# Generated by Django 5.0.7 on 2024-07-23 07:10

import django_jsonform.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('yandexDirectBot', '0005_remove_yandexdirectaccount_week_budget_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='goals',
            field=django_jsonform.models.fields.JSONField(blank=True, default=None, null=True, verbose_name='Цели'),
        ),
    ]