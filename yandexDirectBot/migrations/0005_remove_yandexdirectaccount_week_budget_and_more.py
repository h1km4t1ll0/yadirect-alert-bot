# Generated by Django 5.0.6 on 2024-07-14 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yandexDirectBot', '0004_remove_project_week_budget_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='yandexdirectaccount',
            name='week_budget',
        ),
        migrations.AddField(
            model_name='yandexdirectaccount',
            name='min_sum',
            field=models.IntegerField(default=0, verbose_name='Порог для уведомления'),
        ),
    ]
