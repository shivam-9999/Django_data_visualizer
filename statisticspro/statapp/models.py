from django.db import models
from django.core.validators import MinValueValidator, MaxLengthValidator

class Business(models.Model):
    name = models.CharField(
        max_length=255, 
        validators=[MaxLengthValidator(255)]
    )
    revenue = models.FloatField(
        default=0.0, 
        validators=[MinValueValidator(0.0)]
    )
    profit = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0)]
    )
    employees = models.IntegerField(
        default=0,
        validators=[MinValueValidator(1)]
    )
    country = models.CharField(
        max_length=255, 
        validators=[MaxLengthValidator(255)]
    )

    class Meta:
        unique_together = ('name', 'country')  # Ensure uniqueness across name and country

    def __str__(self):
        return f"{self.name} - {self.country}"
