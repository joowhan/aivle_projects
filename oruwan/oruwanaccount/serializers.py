from .models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    def validate_password(self, value):
        validate_password(value)  # 비밀번호 유효성 검사
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            password = validated_data['password']
        )
        return user
    class Meta:
        model = User
        fields = ['username', 'email', 'password']