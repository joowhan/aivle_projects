# urls.py
from django.urls import path
from . import views


app_name = 'routine'

urlpatterns = [
    path('routines/', views.RoutineAPI.as_view()),
    path('routine_register/', views.RoutineRegisterAPI.as_view()),
    path('routines/detail/', views.RoutineDetailAPI.as_view()),
    path('routines/detail/update/', views.RoutineDetailUpdateAPI.as_view()),
]