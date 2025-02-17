from rest_framework import serializers 
from .models import Business

class BusinessSerializer (serializers.ModelSerializer):
    class Meta:
        model=Business 
        fields='__all__'
    
    def validate(self, data):
        name = data.get('name')
        country = data.get('country')

        # Retrieve the instance being updated, if it exists
        instance = self.instance

        # Check if a business with the same name and country exists, excluding the current instance
        business_exists = Business.objects.filter(name=name, country=country).exclude(id=instance.id if instance else None).exists()

        if business_exists:
            raise serializers.ValidationError(
                "A business with the same name and country already exists."
            )

        return data