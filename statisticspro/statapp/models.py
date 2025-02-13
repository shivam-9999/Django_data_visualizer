from django.db import models

# create your model hjere

class Business(models.Model):
    name = models.CharField(max_length=255)
    revenue= models.FloatField(default=0.0)
    profit = models.FloatField(default=0.0)
    employees = models.IntegerField(default=0)
    country = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
    