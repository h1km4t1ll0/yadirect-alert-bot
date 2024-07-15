from django.db import models


class Chat(models.Model):
    chat_id = models.BigIntegerField(
        verbose_name='ID чата',
        null=False,
        blank=False
    )

    name = models.CharField(
        max_length=100,
        verbose_name='Название чата',
        null=False,
        blank=False
    )

    objects = models.Manager()

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'

    def __str__(self):
        return f'# {str(self.chat_id)} {self.name}'


class Alert(models.Model):
    chat = models.ManyToManyField(
        to=Chat,
        verbose_name='Чаты',
        null=False,
        blank=False
    )
    alert_time = models.TimeField(
        verbose_name='Время уведомления по МСК',
        null=False,
        blank=False
    )
    objects = models.Manager()

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'

    def __str__(self):
        return f'Уведомление для {", ".join([each.name for each in self.chat.all()])}'


class YandexDirectAccount(models.Model):
    name = models.CharField(
        max_length=100,
        verbose_name='Название аккаунта',
        null=False,
        blank=False
    )

    api_key = models.CharField(
        max_length=100,
        verbose_name='Ключ API',
        null=False,
        blank=False
    )

    balance = models.FloatField(
        verbose_name='Баланс аккаунта',
        null=True,
        blank=True
    )

    notified = models.BooleanField(
        verbose_name='Оповещен о том, что баланс ниже нормы',
        null=True,
        blank=True,
        default=False
    )

    min_sum = models.IntegerField(
        verbose_name='Порог для уведомления',
        null=False,
        blank=False,
        default=0
    )

    objects = models.Manager()

    class Meta:
        verbose_name = 'Аккаунт Яндекс.Директ'
        verbose_name_plural = 'Аккаунты Яндекс.Директ'

    def __str__(self):
        return self.name


class Project(models.Model):
    alerts = models.ManyToManyField(
        to=Alert,
        verbose_name='Уведомления',
        null=False,
        blank=False
    )

    yandex_direct_accounts = models.ManyToManyField(
        to=YandexDirectAccount,
        verbose_name='Аккаунты Яндекс.Директ',
        null=False,
        blank=False
    )

    name = models.CharField(
        max_length=100,
        verbose_name='Название проекта',
        null=False,
        blank=False
    )

    objects = models.Manager()

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'

    def __str__(self):
        return self.name
