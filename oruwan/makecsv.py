import os
import django
from django.conf import settings

# Django 프로젝트의 설정 모듈을 설정
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from challenge.models import Challenge
import csv

data = Challenge.objects.all()

with open('data.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['id','total_duration', 'challenge_start_date', 'challenge_expired_date','start_time', 'category'])  # 필드 이름을 씁니다.
    for item in data:
        writer.writerow([item.id,item.total_duration, item.challenge_start_date, item.challenge_expired_date, item.start_time, item.category])