# settings.py
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Correcto: SECRET_KEY se carga desde el .env
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', '2teq7sb!(3$kz+(muxcb%lm+6!br^(=hqw#-x%-7c(u^r+o$@%')

DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'djongo', # <-- Asegúrate de que esta línea esté eliminada o comentada
    'myapp',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pltds.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pltds.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Configuración de PyMongo
# Aquí es donde deben cargarse las variables para PyMongo desde el .env
MONGO_URI = os.getenv('MONGO_URI') # Cargará la URI completa
MONGO_DB_NAME = os.getenv('MONGO_NAME') # <--- ¡Nueva línea crucial! Esto cargará 'parroquia'


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'

CORS_ALLOW_ALL_ORIGINS = True

# Correcto: JWT_SECRET se carga desde el .env
JWT_SECRET = os.getenv('JWT_SECRET', 'TU_CLAVE_SECRETA_DE_RESPALDO_MUY_LARGA_AQUI')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# --- ¡ELIMINA O COMENTA TODAS LAS SIGUIENTES LÍNEAS! ---
# settings  # <--- Esta línea es un comentario o una variable que no hace nada
#
# MONGO_URI='mongodb+srv://maximilianochandiaf:parroquia@cluster0.ymrmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
# MONGO_NAME=parroquia
# SECRET_KEY=2teq7sb!(3$kz+(muxcb%lm+6!br^(=hqw#-x%-7c(u^r+o$@%
# JWT_SECRET=zU2#K!p@9$yG&5vX*fRq^7cE(bM)aL0+dN-hJ_wP?oT/sI;l{V}q[U]r@x:C
# --- ¡FIN DE LAS LÍNEAS A ELIMINAR/COMENTAR! ---