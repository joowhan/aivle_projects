from django.shortcuts import render
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.views import APIView
from oruwanaccount.models import User
from challenge.models import UserChallenge
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q

class MyPageView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user_id = request.data.get('user_id')
        print(user_id)
        try:
            user = User.objects.get(pk=user_id)
            money = user.user_money

            challenge_status_success = UserChallenge.objects.filter(Q(is_done=True) & Q(final_status=True), user_id=user_id).count()
            challenge_status_fail = UserChallenge.objects.filter(Q(is_done=True) & Q(final_status=False), user_id=user_id).count()
            challenge_status_ing = UserChallenge.objects.filter(Q(is_done=False), user_id=user_id).count()
            
            return Response({'user_money': money, 'challenge_status_success': challenge_status_success, 'challenge_status_fail': challenge_status_fail, 'challenge_status_ing': challenge_status_ing})
        except User.DoesNotExist:
            return Response({'error': 'User matching query does not exist.'}, status=status.HTTP_404_NOT_FOUND)