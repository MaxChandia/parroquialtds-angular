# myapp/db_utils.py
from pymongo import MongoClient
from django.conf import settings

_mongo_client_instance = None

def get_mongo_client():
    """
    Obtiene y devuelve una instancia de MongoClient (singleton).
    La conexión se establece solo la primera vez que se llama a esta función.
    """
    global _mongo_client_instance
    if _mongo_client_instance is None:
        try:
            if not settings.MONGO_URI:
                raise ValueError("MONGO_URI no está configurada en settings.py o .env. Por favor, proporcione la URI completa de MongoDB Atlas.")

            _mongo_client_instance = MongoClient(settings.MONGO_URI)

        except Exception as e:
            print(f"Error al intentar conectar con MongoDB: {e}")
            raise # Relanzar la excepción para que el traceback sea visible
    return _mongo_client_instance

def get_mongo_db():
    """
    Obtiene y devuelve una instancia de la base de datos MongoDB.
    """
    client = get_mongo_client()
    return client[settings.MONGO_DB_NAME] # Asume que MONGO_DB_NAME está definido en settings.py