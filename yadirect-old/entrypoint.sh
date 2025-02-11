#!/bin/bash

echo "CREATE DATABASE ${DATABASE_NAME};" > initial.sql
psql "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOST}" -f initial.sql
python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py initadmin
gunicorn yandexDirectBot.wsgi:application -b 0.0.0.0:8000 --env DJANGO_SETTINGS_MODULE=yandexDirectBot.settings
