from rest_framework import serializers 
from .models import Business

class BusinessSerializer (serializers.ModelSerializer):
    class Meta:
        model=Business 
        fields='__all__'
    
    def validate(self, data):
        name = data.get('name')
        country = data.get('country')

        if Business.objects.filter(name=name, country=country).exists():
            raise serializers.ValidationError(
                "A business with the same name and country already exists."
            )

        return data