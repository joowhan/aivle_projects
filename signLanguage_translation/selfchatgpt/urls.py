# blog/urls.py
from django.urls import path
from . import views

#mysite에서 위임
app_name = 'selfchatgpt'
urlpatterns = [
    path('', views.index, name='index'),
    path('chat', views.chat, name='chat'),
]
