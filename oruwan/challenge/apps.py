from django.apps import AppConfig
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django.apps import AppConfig
from django.db.models import F
from datetime import date

class ChallengeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'challenge'

    def ready(self):
        scheduler = BackgroundScheduler()
        scheduler.remove_all_jobs()
        def update_fail_challenge_count():
            from .models import UserChallenge, ChallengeStatus
            user_challenges = UserChallenge.objects.filter(status=False)
            for user_challenge in user_challenges:
                # 새로운 ChallengeStatus 데이터 생성 및 저장
                challenge_status = ChallengeStatus(
                    user_challenge=user_challenge,
                    user=user_challenge.user,
                    challenge=user_challenge.challenge,
                    challenge_today_date=date.today(),
                    is_success=False,
                    is_done=False,
                    final_status=True,
                    total_success_count=0,
                    success_ratio=0,
                    total_fail_count=0,
                    fail_ratio=0,
                )
                
                challenge_status.save()
            UserChallenge.objects.filter(status=True).update(status=False)
            UserChallenge.objects.all().update(user_authenticated_fail_count=0)
            userchallenges = UserChallenge.objects.filter(challenge__challenge_calculate_date__lte=date.today(), is_done=False, final_status=True)
            for userchallenge in userchallenges:
                userchallenge.is_done = True
                userchallenge.challenge.certified_count += 1
                userchallenge.challenge.save()
                userchallenge.save()
            userchallenges_false = UserChallenge.objects.filter(challenge__challenge_calculate_date__lte=date.today(), is_done=False, final_status=False)
            for userchallenge_false in userchallenges_false:
                userchallenge_false.is_done = True
                userchallenge_false.challenge.save()
                userchallenge_false.save()
        scheduler.add_job(
            update_fail_challenge_count,
            CronTrigger(hour=23, minute=59, second=55),
            max_instances=1
        )
        scheduler.start()