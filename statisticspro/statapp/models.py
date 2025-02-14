from django.db import models
from django.core.validators import MinValueValidator, MaxLengthValidator

class Business(models.Model):
    name = models.CharField(
        max_length=255, 
        unique=True,  # Ensures that business names are unique
        validators=[MaxLengthValidator(255)]
    )
    revenue = models.FloatField(
        default=0.0, 
        validators=[MinValueValidator(0.0)]  # Revenue cannot be negative
    )
    profit = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0)]  # Profit cannot be negative
    )
    employees = models.IntegerField(
        default=0,
        validators=[MinValueValidator(1)]  # Business must have at least one employee
    )
    country = models.CharField(
        max_length=255, 
        validators=[MaxLengthValidator(255)]
    )

    def __str__(self):
        return self.name
