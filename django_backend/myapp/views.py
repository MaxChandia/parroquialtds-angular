import json
import jwt
import datetime
import traceback
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.text import slugify
from django.contrib.auth.hashers import check_password, make_password #
from .models import User, Post
import os 
from django.conf import settings

# ================================
# Endpoint de Login (POST)
# ================================
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body.decode('utf-8'))
            username = body.get('username')
            password = body.get('password')

            if not username or not password:
                return JsonResponse({'error': 'Usuario y contraseña son requeridos.'}, status=400)

            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Credenciales inválidas.'}, status=401) 

            if password == user.password:
                payload = {
                    'user_id': str(user._id),
                    'username': user.username,
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
# Middleware o Decorador de Autenticación JWT
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
    """
    GET  /api/posts/       -> Devuelve lista de posts (accesible públicamente).
    POST /api/posts/       -> Crea un nuevo post (protegido por JWT).
    """
    if request.method == 'GET':
        posts_data = []
        for post in Post.objects.all():
            posts_data.append({
                'id': str(post._id),
                'title': post.title,
                'slug': post.slug,
                'content': post.content,
                'imageUrls': post.imageUrls,
                'createdAt': post.createdAt.isoformat(),
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

        image_urls_data = body.get('imageUrls', []) 

        new_post = Post.objects.create(
            title=body['title'],
            slug=generated_slug,
            content=body['content'],
            imageUrls=image_urls_data
        )
        post_data = {
            'id': str(new_post._id),
            'title': new_post.title,
            'slug': new_post.slug,
            'content': new_post.content,
            'imageUrls': new_post.imageUrls,
            'createdAt': new_post.createdAt.isoformat(),
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
    """
    GET    /api/posts/<slug>/    -> Obtener un post por slug (público).
    PUT    /api/posts/<slug>/    -> Actualizar un post existente (protegido por JWT).
    DELETE /api/posts/<slug>/    -> Eliminar un post (protegido por JWT).
    """
    try:
        post = Post.objects.get(slug=slug)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post no encontrado'}, status=404)

    if request.method == 'GET':
        post_data = {
            'id': str(post._id),
            'title': post.title,
            'slug': post.slug,
            'content': post.content,
            'imageUrls': post.imageUrls,
            'createdAt': post.createdAt.isoformat(),
        }
        return JsonResponse(post_data)

    elif request.method == 'PUT':
        return jwt_required(_update_post)(request, post) 

    elif request.method == 'DELETE':
        return jwt_required(_delete_post)(request, post) 
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def _update_post(request, post):
    """
    Función interna para actualizar un post, llamada solo si el token JWT es válido.
    """
    try:
        body = json.loads(request.body.decode('utf-8'))
        updatable_fields = ['title', 'slug', 'content', 'imageUrls']
        updated = False
        for field in updatable_fields:
            if field in body:
                setattr(post, field, body[field])
                updated = True

        if not updated:
            return JsonResponse(
                {'error': 'No se encontraron campos válidos para actualizar.'},
                status=400
            )

        post.save()
        updated_data = {
            'id': str(post._id),
            'title': post.title,
            'slug': post.slug,
            'content': post.content,
            'imageUrls': post.imageUrls,
            'createdAt': post.createdAt.isoformat(),
        }
        return JsonResponse(updated_data)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Formato JSON inválido.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def _delete_post(request, post):
    """
    Función interna para eliminar un post, llamada solo si el token JWT es válido.
    """
    try:
        post.delete()
        return HttpResponse(status=204)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
