from django.urls import path
from .views import RegisterView, LoginView, LogoutView, SmsSendView, SMSVerificationView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('smssend/', SmsSendView.as_view(), name='smssend'),
    path('smsverify/', SMSVerificationView.as_view(), name='smsverify'),
]