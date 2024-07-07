## Локальный запуск
`poetry run python3 manage.py migrate`
`poetry run python3 manage.py makemigrations`
`poetry run python3 manage.py migrate`
`poetry run python3 manage.py initadmin`
`docker run -p 6379:6379 --name some-redis -d redis`

`celery -A shelbyBot worker --loglevel=info` - в другом терминале
`celery -A shelbyBot beat --loglevel=info` - в другом терминале
