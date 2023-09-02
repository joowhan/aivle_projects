# urls.py
from django.urls import path
from . import views


app_name = 'challenge'

urlpatterns = [
    path('challenges/',views.ChallengeListAPI.as_view()),
    path('challenges/<int:pk>/',views.ChallengeDetailAPI.as_view()),
    path('joinablechallenges/',views.JoinableChallengeListAPI.as_view()),
    path('joinablechallenges/<int:pk>/',views.JoinableChallengeDetailAPI.as_view()),
    path('joinedchallenges/', views.JoinedChallengeListAPI.as_view()),
    path('joinedchallenges/<int:pk>/', views.JoinedChallengeDetailAPI.as_view()),
    path('joinedchallenges/status/', views.JoinedChallengeStatusListAPI.as_view()),
    path('joinedchallenges/status/<int:user_challenge_id>/', views.JoinedChallengeStatusAPI.as_view(), name='joined_challenge_status'),
    path('detectai/', views.DetectAIAPIView.as_view()),
    path('recommendai/', views.RecommnedAIAPIView.as_view()),
    path('calculate/', views.CalculateView.as_view()),
]

