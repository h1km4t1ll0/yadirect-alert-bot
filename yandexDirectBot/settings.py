"""
Django settings for yandexDirectBot project.

Generated by 'django-admin startproject' using Django 5.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""
import os
from pathlib import Path
import sentry_sdk

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-%8&a)j$$*52dz+dp_-94r5&ce9=u*o5r-yn11l3%1734#s&bvx'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG", True)
DOMAIN = os.environ.get("DOMAIN", None)
SERVER_MODE = os.environ.get("SERVER", '') in ["True", True]

ALLOWED_HOSTS = [DOMAIN, '127.0.0.1', 'localhost', f'https://{DOMAIN}']
if not DEBUG:
    CSRF_TRUSTED_ORIGINS = [f'https://{DOMAIN}']

if SERVER_MODE:
    CSRF_TRUSTED_ORIGINS = [f'https://{DOMAIN}']

# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'yandexDirectBot',
    'django_jsonform',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'yandexDirectBot.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates']
        ,
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

WSGI_APPLICATION = 'yandexDirectBot.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

if os.environ.get("SERVER", '') in ["True", True]:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get("DATABASE_NAME", ''),
            'USER': os.environ.get('POSTGRES_USER', ''),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
            'HOST': os.environ.get('DATABASE_HOST', ''),
            'PORT': os.environ.get("DATABASE_PORT", ''),
        }
    }

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = []

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

STATIC_ROOT = '/app/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# YandexDirect VARS 311515868 69279259
YANDEX_DIRECT_BASE_URL = os.environ.get("YANDEX_DIRECT_BASE_URL", 'https://api.direct.yandex.ru')
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", 'redis://localhost:6379')
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", 'redis://localhost:6379')
BOT_TOKEN = os.environ.get('BOT_TOKEN', '')

CELERY_BEAT_SCHEDULE = {
    'every_day_alert': {
        'task': 'yandexDirectBot.tasks.every_day_alert',
        'schedule': 60,  # Run every 60 seconds (once a minute)
    },
    'balance_change_alert': {
        'task': 'yandexDirectBot.tasks.balance_change_alert',
        'schedule': 300,  # Run every 3600 seconds (once an hour)
    },
}

# Sentry setup
sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN", None),
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)

# JAZZMIN SETTINGS
JAZZMIN_SETTINGS = {
    "topmenu_links": [
        {"name": "Инструкция", "url": "/instruction", "new_window": True},
    ],
}
