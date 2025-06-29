# Generated by Django 4.2.3 on 2025-06-15 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0002_event_preferences_event_skills_and_more'),
        ('user', '0004_user_preferences_user_skills'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='events',
            field=models.ManyToManyField(blank=True, related_name='participants', to='event.event'),
        ),
    ]
