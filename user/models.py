from datetime import date

from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework.exceptions import ValidationError


def validate_rating(value):
    if value < 0 or value > 5:
        raise ValidationError("The rating must be between 0 and 5.")
    else:
        return value

class UserRole(models.TextChoices):
    INDIVIDUAL = 'individual'
    COMPANY = 'company'

class User(AbstractUser):
    role = models.CharField(
        max_length=50,
        choices=UserRole.choices,
        default=UserRole.INDIVIDUAL
    )
    description = models.TextField()
    rating = models.IntegerField(validators=[validate_rating], default=0)
    date_of_birth = models.DateField(default=date.today)


    class Meta:
        app_label = 'user'

    def __str__(self):
        return f"{self.username}"
