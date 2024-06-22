#!/bin/bash

#sleep 10
psql postgresql://postgres:d4a8f0435b2b866f855323d7d021a79164d2e13b@yadirect-database -f initial.sql
python3 manage.py collectstatic --noinput
#sleep 1
python3 manage.py makemigrations
#sleep 1
python3 manage.py migrate
#sleep 1
python3 manage.py initadmin
#sleep 1
gunicorn yandexDirectBot.wsgi:application -b 0.0.0.0:8000 --env DJANGO_SETTINGS_MODULE=yandexDirectBot.settings
#--user www-data --group www-data
