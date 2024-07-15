#!/bin/bash

echo "CREATE DATABASE ${DATABASE_NAME};" > initial.sql
psql postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_NAME} -f initial.sql
python3 manage.py collectstatic --noinput
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py initadmin
gunicorn yandexDirectBot.wsgi:application -b 0.0.0.0:8000 --env DJANGO_SETTINGS_MODULE=yandexDirectBot.settings
