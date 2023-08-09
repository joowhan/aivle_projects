from rest_framework import serializers
from .models import Challenge, UserChallenge, ChallengeStatus
 
class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class RegisterUserChallengeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserChallenge
        fields = ['user', 'challenge', 'register_start_date', 'register_expired_date', 'user_register']
    
class UserChallengeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserChallenge
        fields = '__all__'
        
class DetectAISerializer(serializers.Serializer):
    # 인공지능 모델에 전달할 필드 정의
    field1 = serializers.ImageField()
    user_id = serializers.IntegerField()
    challenge_id = serializers.IntegerField()

class ChallengeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeStatus
        fields = '__all__'

class ChallengeDayStatusSerializer(serializers.ModelSerializer):
    total_duration = serializers.IntegerField(source='challenge.total_duration', read_only=True)
    success_percentage = serializers.DecimalField(max_digits=2, decimal_places=0)
    fail_percentage = serializers.DecimalField(max_digits=2, decimal_places=0)
    
    class Meta:
        model = ChallengeStatus
        fields = ['user_challenge', 'challenge_today_date', 'is_success', 'success_ratio', 'success_percentage','fail_ratio', 'fail_percentage', 'total_duration', 'total_fail_count', 'total_success_count', 'final_status']

class RecommendAISerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=255)
    user_id = serializers.IntegerField()
    challenge_id = serializers.IntegerField()