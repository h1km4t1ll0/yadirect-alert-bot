# ScavengerHunt bot

## Описание
Бот написан с использованием pytelegrambotapi,
админпанель реализована на django. Бот позволяет
проводить массовые мероприятия и обеспечивает стабильную
работу под нагрузкой

## Локальный запуск
`poetry run python3 manage.py migrate`
`poetry run python3 manage.py makemigrations`
`poetry run python3 manage.py migrate`
`poetry run python3 manage.py initadmin`
`docker run -p 6379:6379 --name some-redis -d redis`

`celery -A shelbyBot worker --loglevel=info` - в другом терминале
`celery -A shelbyBot beat --loglevel=info` - в другом терминале
