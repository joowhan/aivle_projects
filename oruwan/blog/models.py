import os

from django.db import models
from oruwanaccount.models import User
from django.utils import timezone

## Routine
class RoutineBlog(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True) #마지막으로 저장된 시점을 자동으로 저장
    user = models.ForeignKey( User,on_delete=models.CASCADE, null = True)
    routine_blog_image = models.ImageField(upload_to='routineblogs/images/%Y/%m/%d/', blank=True)
    views = models.PositiveIntegerField('VIEWS', default=0)
    last_viewed_date = models.DateTimeField(default=timezone.now)
    like_users = models.ManyToManyField(User, related_name='liked_blogs')
    
    
    def __str__(self):
        return f'[{self.pk}]{self.routine}::{self.created_at}'
    
    def get_absolute_url(self):
        return f'/routine/{self.pk}/'
    
    def increase_views(self):
        self.views += 1
        self.save()


class RoutineComment(models.Model):
    routine = models.ForeignKey(RoutineBlog, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True, null=False, blank=False)
    comment_count = models.IntegerField(default=0)
    comment = models.TextField()
    parent_comment = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.comment

## Challenge
class ChallengeBlog(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True) #마지막으로 저장된 시점을 자동으로 저장
    challenge_blog_image = models.ImageField(upload_to='challengeblogs/images/%Y/%m/%d/', blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    views = models.PositiveIntegerField('VIEWS', default=0)
    last_viewed_date = models.DateTimeField(default=timezone.now)
    like_challenge_users = models.ManyToManyField(User, related_name='liked_challenges')
    
    def __str__(self):
        return f'[{self.pk}]{self.challenge}::{self.created_at}'
    
    def get_absolute_url(self):
        return f'/challenge/{self.pk}/'
    
class ChallengeComment(models.Model):
    challenge = models.ForeignKey(ChallengeBlog, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True, null=False, blank=False)
    comment_count = models.IntegerField(default=0)
    comment = models.TextField()
    parent_comment = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.comment
    
