from django.db import models
from oruwanaccount.models import User
from django.utils import timezone
from datetime import timedelta

class Challenge(models.Model):
    challenge_name = models.CharField(max_length=255)
    challenge_class_idx = models.IntegerField(null=True)
    challenge_content = models.TextField()
    challenge_guide = models.TextField()
    challenge_image = models.ImageField(upload_to='challenges/images/%Y/%m/%d/', blank=True)
    admin_challenge_image = models.ImageField(upload_to='adminChallenges/images/%Y/%m/%d/', blank=True)
    no_admin_challenge_image = models.ImageField(upload_to='noAdminChallenges/images/%Y/%m/%d/', blank=True)
    challenge_start_date = models.DateField()
    challenge_expired_date = models.DateField()
    total_duration = models.IntegerField()
    join_count = models.IntegerField(default=0)
    certified_count = models.IntegerField(default=0)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    prize = models.IntegerField(default=0)
    category = models.IntegerField()
    challenge_calculate_date = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.challenge_calculate_date = self.challenge_expired_date + timedelta(days=self.total_duration) + timedelta(days=1)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.challenge_name

class UserChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    user_authenticated_fail_count = models.IntegerField(default=0, blank=True)
    register_start_date = models.DateField()
    register_expired_date = models.DateField(blank=True)
    user_register = models.BooleanField(default=False)  #등록 여부
    status = models.BooleanField(default=False)  #인증 여부 
    is_done = models.BooleanField(default=False)
    final_status = models.BooleanField(default=True)
    calculate_is_done = models.BooleanField(default=False)
    
    
class ChallengeStatus(models.Model):
    user_challenge = models.ForeignKey(UserChallenge, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    challenge_today_date = models.DateField()
    is_success = models.BooleanField(default=False)
    is_done = models.BooleanField(default = False) # 챌린지 완전 최종 끝남 여부
    final_status = models.BooleanField(default=True)  # 최종 성공 여부
    total_success_count = models.IntegerField(default=0) # is_success가 True일 때 count 갱신
    success_ratio = models.IntegerField(default=0) # 성공비율
    total_fail_count =  models.IntegerField(default=0) #is_success가 False일 때 count 갱신
    fail_ratio = models.IntegerField(default=0) # 실패 비율
    


    
    