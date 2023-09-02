from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from oruwanaccount.models import User

class MyAuthBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        # 이메일과 비밀번호를 기반으로 사용자를 인증하는 로직을 구현
        # 인증에 성공한 경우 해당 사용자 인스턴스를 반환
        # 인증에 실패한 경우 None을 반환
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if user.check_password(password):
            # 계정 잠금 로직 추가
            if user.is_locked():
                return None  # 계정이 잠긴 경우 None을 반환하여 인증 실패로 처리
            else:
                # 로그인 성공 시 실패 횟수 초기화
                user.failed_login_attempts = 0
                user.locked_until = None
                user.is_active=True
                user.save()
                return user

        # 로그인 실패 시 실패 횟수 증가
        user.failed_login_attempts += 1
        user.save()

        # 실패 횟수에 따라 계정 잠금 처리
        if user.failed_login_attempts >= 3:  # 예를 들어 3번의 실패 시도 이후에 잠금
            user.locked_until = timezone.now() + timezone.timedelta(minutes=30)  # 30분 동안 계정 잠금
            user.is_active=False
            user.save()

        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None