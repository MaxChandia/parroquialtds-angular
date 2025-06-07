# myapp/views.py
import json
import jwt
import datetime
import traceback
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.text import slugify
# from django.contrib.auth.hashers import check_password, make_password # No se usará para User de Mongo
from django.conf import settings

from .db_utils import get_mongo_db # <-- Importar la función de conexión a MongoDB
from bson.objectid import ObjectId # <-- Necesario para trabajar con _id de MongoDB

# ================================
# Endpoint de Login (POST)
# ================================
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        db = get_mongo_db() # Obtener la instancia de la base de datos
        users_collection = db['User'] # Acceder a la colección 'User'

        try:
            body = json.loads(request.body.decode('utf-8'))
            username_from_request = body.get('username') # 'username' es el nombre que el frontend probablemente envía
            password_from_request = body.get('password') # 'password' es el nombre que el frontend probablemente envía

            if not username_from_request or not password_from_request:
                return JsonResponse({'error': 'Usuario y contraseña son requeridos.'}, status=400)

            # Buscar el usuario en la colección de MongoDB usando el campo 'user' (confirmado por las capturas)
            user_doc = users_collection.find_one({'user': username_from_request}) # <-- ¡CAMBIO AQUÍ: 'user' en vez de 'username'!

            if not user_doc:
                return JsonResponse({'error': 'Credenciales inválidas.'}, status=401)

            # Comprobar la contraseña (texto plano, como confirmaste)
            # ADVERTENCIA: Almacenar contraseñas en texto plano es una vulnerabilidad de seguridad.
            # Se recomienda encarecidamente usar hashing (ej. bcrypt, Argon2) para las contraseñas.
            if password_from_request == user_doc.get('password'): # 'password' es correcto en la DB
                payload = {
                    'user_id': str(user_doc['_id']), # Convertir ObjectId a string
                    'username': user_doc.get('user'), # <-- ¡CAMBIO AQUÍ: usar 'user' para el payload del token!
                    'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=settings.JWT_EXPIRATION_HOURS)
                }
                jwt_token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
                return JsonResponse({'token': jwt_token})
            else:
                return JsonResponse({'error': 'Credenciales inválidas.'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato JSON inválido.'}, status=400)
        except Exception as e:
            tipo = e.__class__.__name__
            detalle = str(e)
            stack = traceback.format_exc()
            print("ERROR en login:", tipo, detalle)
            print(stack)
            return JsonResponse({
                'error_type': tipo,
                'error_msg': detalle
            }, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


# ================================
# Middleware o Decorador de Autenticación JWT (sin cambios)
# ================================
def jwt_required(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return JsonResponse({'error': 'Token de autenticación requerido.'}, status=401)

        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            request.user_id = payload['user_id']
            # Asegúrate de que el campo 'username' en el payload del token se llame 'user' si lo usas en el backend
            # O ajusta cómo tu frontend lo procesa. Manteniendo 'username' aquí para compatibilidad con request.username.
            request.username = payload['username']
            return view_func(request, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expirado.'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Token inválido.'}, status=401)
        except IndexError:
            return JsonResponse({'error': 'Formato de token inválido. Usa "Bearer <token>".'}, status=401)
        except Exception as e:
            print(f"Error en jwt_required: {e}")
            return JsonResponse({'error': 'Error de autenticación.'}, status=500)
    return wrapper

# ======================================================
# Listado de POSTS (GET) / Crear un POST nuevo (POST)
# ======================================================
@csrf_exempt
def posts_view(request):
    db = get_mongo_db() # Obtener la instancia de la base de datos
    posts_collection = db['Post'] # Acceder a la colección 'Post'

    """
    GET   /api/posts/       -> Devuelve lista de posts (accesible públicamente).
    POST  /api/posts/       -> Crea un nuevo post (protegido por JWT).
    """
    if request.method == 'GET':
        posts_data = []
        for post_doc in posts_collection.find({}): # Usar find() de PyMongo
            posts_data.append({
                'id': str(post_doc['_id']), # Convertir ObjectId a string
                'title': post_doc.get('title'),
                'slug': post_doc.get('slug'),
                'content': post_doc.get('content'),
                'imageUrls': post_doc.get('imageUrls', []), # Usar .get() con default para seguridad
                'createdAt': post_doc.get('createdAt').isoformat() if post_doc.get('createdAt') else None,
            })
        return JsonResponse(posts_data, safe=False)

    elif request.method == 'POST':
        return jwt_required(_create_post)(request)

    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def _create_post(request):
    """
    Función interna para crear un post, llamada solo si el token JWT es válido.
    """
    db = get_mongo_db()
    posts_collection = db['Post']

    try:
        body = json.loads(request.body.decode('utf-8'))
        required_fields = ['title', 'content']
        for field in required_fields:
            if field not in body:
                return JsonResponse(
                    {'error': f'El campo "{field}" es requerido.'},
                    status=400
                )
        
        generated_slug = slugify(body['title'])

        # Asegurarse de que el slug sea único
        original_slug = generated_slug
        counter = 1
        while posts_collection.count_documents({'slug': generated_slug}) > 0:
            generated_slug = f"{original_slug}-{counter}"
            counter += 1

        image_urls_data = body.get('imageUrls', [])

        # Documento a insertar en MongoDB
        post_document = {
            'title': body['title'],
            'slug': generated_slug,
            'content': body['content'],
            'imageUrls': image_urls_data, # PyMongo maneja listas Python directamente
            'createdAt': datetime.datetime.now(datetime.timezone.utc), # Guardar fecha y hora actual
        }

        result = posts_collection.insert_one(post_document) # Usar insert_one de PyMongo
        
        post_data = {
            'id': str(result.inserted_id), # El ID generado por MongoDB
            'title': post_document['title'],
            'slug': post_document['slug'],
            'content': post_document['content'],
            'imageUrls': post_document['imageUrls'],
            'createdAt': post_document['createdAt'].isoformat(),
        }
        return JsonResponse(post_data, status=201)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Formato JSON inválido.'}, status=400)
    except Exception as e:
        tipo = e.__class__.__name__
        detalle = str(e)
        stack = traceback.format_exc()
        print("ERROR al crear Post:", tipo, detalle)
        print(stack)
        return JsonResponse({
            'error_type': tipo,
            'error_msg': detalle
        }, status=500)

# =============================================================
# Operaciones sobre un POST individual: GET / PUT / DELETE
# =============================================================
@csrf_exempt
def post_detail_view(request, slug):
    db = get_mongo_db()
    posts_collection = db['Post']

    """
    GET    /api/posts/<slug>/      -> Obtener un post por slug (público).
    PUT    /api/posts/<slug>/      -> Actualizar un post existente (protegido por JWT).
    DELETE /api/posts/<slug>/      -> Eliminar un post (protegido por JWT).
    """
    # Buscar el post por slug
    post_doc = posts_collection.find_one({'slug': slug})
    
    if not post_doc:
        return JsonResponse({'error': 'Post no encontrado'}, status=404)

    if request.method == 'GET':
        post_data = {
            'id': str(post_doc['_id']),
            'title': post_doc.get('title'),
            'slug': post_doc.get('slug'),
            'content': post_doc.get('content'),
            'imageUrls': post_doc.get('imageUrls', []),
            'createdAt': post_doc.get('createdAt').isoformat() if post_doc.get('createdAt') else None,
        }
        return JsonResponse(post_data)

    elif request.method == 'PUT':
        # Pasar el documento (post_doc) directamente a la función de actualización
        return jwt_required(_update_post)(request, post_doc)

    elif request.method == 'DELETE':
        # Pasar el documento (post_doc) directamente a la función de eliminación
        return jwt_required(_delete_post)(request, post_doc)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def _update_post(request, post_doc): # post_doc es el documento de MongoDB
    """
    Función interna para actualizar un post, llamada solo si el token JWT es válido.
    """
    db = get_mongo_db()
    posts_collection = db['Post']

    try:
        body = json.loads(request.body.decode('utf-8'))
        
        # Diccionario para almacenar los campos a actualizar
        update_fields = {}
        if 'title' in body:
            update_fields['title'] = body['title']
            # Regenerar slug si el título cambia
            new_slug = slugify(body['title'])
            if new_slug != post_doc['slug']:
                # Asegurarse de que el nuevo slug también sea único
                original_new_slug = new_slug
                counter = 1
                while posts_collection.count_documents({'slug': new_slug, '_id': {'$ne': post_doc['_id']}}) > 0:
                    new_slug = f"{original_new_slug}-{counter}"
                    counter += 1
                update_fields['slug'] = new_slug
            else:
                update_fields['slug'] = post_doc['slug'] # Mantener el slug si el título no cambia y no se envió uno nuevo.


        if 'content' in body:
            update_fields['content'] = body['content']
        if 'imageUrls' in body:
            update_fields['imageUrls'] = body['imageUrls'] # PyMongo maneja listas directamente

        if not update_fields:
            return JsonResponse(
                {'error': 'No se encontraron campos válidos para actualizar.'},
                status=400
            )

        # Actualizar el documento en MongoDB
        posts_collection.update_one(
            {'_id': post_doc['_id']},
            {'$set': update_fields}
        )

        # Obtener el documento actualizado para la respuesta
        updated_post_doc = posts_collection.find_one({'_id': post_doc['_id']})

        updated_data = {
            'id': str(updated_post_doc['_id']),
            'title': updated_post_doc.get('title'),
            'slug': updated_post_doc.get('slug'),
            'content': updated_post_doc.get('content'),
            'imageUrls': updated_post_doc.get('imageUrls', []),
            'createdAt': updated_post_doc.get('createdAt').isoformat() if updated_post_doc.get('createdAt') else None,
        }
        return JsonResponse(updated_data)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Formato JSON inválido.'}, status=400)
    except Exception as e:
        tipo = e.__class__.__name__
        detalle = str(e)
        stack = traceback.format_exc()
        print("ERROR al actualizar Post:", tipo, detalle)
        print(stack)
        return JsonResponse({
            'error_type': tipo,
            'error_msg': detalle
        }, status=500)

@csrf_exempt
def _delete_post(request, post_doc): # post_doc es el documento de MongoDB
    """
    Función interna para eliminar un post, llamada solo si el token JWT es válido.
    """
    db = get_mongo_db()
    posts_collection = db['Post']

    try:
        result = posts_collection.delete_one({'_id': post_doc['_id']}) # Usar delete_one de PyMongo
        if result.deleted_count > 0:
            return HttpResponse(status=204) # 204 No Content para eliminación exitosa
        else:
            return JsonResponse({'error': 'Post no encontrado para eliminar.'}, status=404)
    except Exception as e:
        tipo = e.__class__.__name__
        detalle = str(e)
        stack = traceback.format_exc()
        print("ERROR al eliminar Post:", tipo, detalle)
        print(stack)
        return JsonResponse({
            'error_type': tipo,
            'error_msg': detalle
        }, status=500)

# ======================================================
# Listado de Usuarios (GET) - ¡NUEVA VISTA!
# ======================================================
@csrf_exempt
# NOTA: Si esta vista debe estar protegida, puedes usar @jwt_required aquí también.
# Por ahora, la dejaré pública para que puedas verificar los usuarios fácilmente.
def users_view(request):
    db = get_mongo_db()
    users_collection = db['User'] # Acceder a la colección 'User'

    """
    GET   /api/users/       -> Devuelve lista de usuarios.
    """
    if request.method == 'GET':
        users_data = []
        try:
            for user_doc in users_collection.find({}): # Usar find() de PyMongo
                users_data.append({
                    'id': str(user_doc['_id']), # Convertir ObjectId a string
                    'user': user_doc.get('user'), # <-- ¡Accede al campo 'user' como está en la DB!
                    'password': user_doc.get('password'), # No recomendable en una API pública, pero lo mantengo por referencia
                    # Añade otros campos que tengas en tu documento de usuario si los necesitas
                    # 'email': user_doc.get('email'),
                    # 'createdAt': user_doc.get('createdAt').isoformat() if user_doc.get('createdAt') else None,
                })
            return JsonResponse(users_data, safe=False)
        except Exception as e:
            tipo = e.__class__.__name__
            detalle = str(e)
            stack = traceback.format_exc()
            print("ERROR al obtener usuarios:", tipo, detalle)
            print(stack)
            return JsonResponse({
                'error_type': tipo,
                'error_msg': detalle
            }, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)