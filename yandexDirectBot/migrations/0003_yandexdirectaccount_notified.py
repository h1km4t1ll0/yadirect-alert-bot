# Generated by Django 5.0.6 on 2024-07-14 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yandexDirectBot', '0002_yandexdirectaccount_balance'),
    ]

    operations = [
        migrations.AddField(
            model_name='yandexdirectaccount',
            name='notified',
            field=models.BooleanField(blank=True, default=False, null=True, verbose_name='Оповещен о том, что баланс ниже нормы'),
        ),
    ]
