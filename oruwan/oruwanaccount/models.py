from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.utils import timezone

class UserManager(BaseUserManager):
    # 일반 user 생성
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('must have user email')
        if not username:
            raise ValueError('must have user username')
        user = self.model(
            email = self.normalize_email(email),
            username = username,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    # 관리자 user 생성
    def create_superuser(self, email, username, password=None):
        user = self.create_user(
            email=email,
            password = password,
            username = username,
        )
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(default='', max_length=100, null=False, blank=False, unique=True)
    username = models.CharField(default='', max_length=100, null=False, blank=False, unique=True)
    locked_until = models.DateTimeField(null=True, blank=True)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    user_money = models.IntegerField(default=300000)
    # User 모델의 필수 field
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    
    # 헬퍼 클래스 사용
    objects = UserManager()

    # 사용자의 username field는 email로 설정
    USERNAME_FIELD = 'email'
    # 필수로 작성해야하는 field
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.username
    
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
    
    def is_locked(self):
        if self.locked_until is not None and self.locked_until > timezone.now():
            return True
        return False
    
    @property
    def is_staff(self):
        return self.is_admin
    
# 네이버클라우드를 활용한 인증 모델
class Authentication(models.Model):
    phone_number = models.CharField('phone_number', max_length=30)
    auth_number = models.CharField('auth_number', max_length=30)

    class Meta:
        db_table = 'authentications' # DB 테이블명
        verbose_name_plural = "휴대폰인증 관리 페이지" # Admin 페이지에서 나타나는 설명
