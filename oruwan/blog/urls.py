# urls.py
from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('routine_blog/',views.RoutineBlogListAPI.as_view()),
    path('routine_blog/<int:pk>/',views.RoutineBlogDetailAPI.as_view()),
    path('routine_blog/create/',views.RoutineBlogCreateAPI.as_view()),
    path('routine_blog/<int:pk>/new_comment/', views.RoutineBlogCommentAPI.as_view()),
    path('routine_blog/<int:routine_id>/comments/', views.RoutineBlogCommentListAPI.as_view()),
    path('routine_blog/<int:routine_id>/comments/<int:pk>/',views.RoutineBlogCommentDetailAPI.as_view()),
    
    path('popular_blog/routine/',views.RoutinePopularBlogListAPI.as_view()),
    path('popular_blog/challenge/',views.ChallengePopularBlogListAPI.as_view()),
    
    path('challenge_blog/',views.ChallengeBlogListAPI.as_view()),
    path('challenge_blog/<int:pk>/',views.ChallengeBlogDetailAPI.as_view()),
    path('challenge_blog/create/',views.ChallengeBlogCreateAPI.as_view()),
    path('challenge_blog/<int:pk>/new_comment/', views.ChallengeBlogCommentAPI.as_view()),
    path('challenge_blog/<int:challenge_id>/comments/', views.ChallengeBlogCommentListAPI.as_view()),
    path('challenge_blog/<int:challenge_id>/comments/<int:pk>/',views.ChallengeBlogCommentDetailAPI.as_view()),   
    
]