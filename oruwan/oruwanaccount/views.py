from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer
from .models import User, Authentication
from challenge.models import Challenge, UserChallenge
import json, requests, time, random
from django.views import View
from django.http import JsonResponse
from .utils import make_signature
from rest_framework.authtoken.models import Token
from rest_framework import status
from datetime import date


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # 이메일 중복 검사   
        if User.objects.filter(email=request.data.get("email")).exists():
            return Response({"is_created": "0", "message": "이미 존재하는 이메일 입니다."})
        if User.objects.filter(username=request.data.get("username")).exists():
            return Response({"is_created": "0", "message": "이미 존재하는 닉네임 입니다."})
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'is_created': '1', "message": "회원가입이 완료되었습니다."})
        else:
            return Response(serializer.errors, status=400)

class LoginView(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not User.objects.filter(email=request.data.get("email")).exists():
            return Response({"is_logined": "0", "message": "이메일이 존재하지 않습니다."})

        # 사용자 인증
        user = authenticate(request, email=email, password=password)

        if user is None:
            attempts = User.objects.filter(email=request.data.get("email")).values_list("failed_login_attempts", flat=True)[0]
            if attempts >= 3:
                return Response({'is_logined': '0', 'message': '계정이 비활성화 되었습니다. 30분 후 다시 시도해주세요.'})
            return Response({'is_logined': '0', 'message': '비밀번호가 {0}회 틀렸습니다. 3회 이상 틀릴 경우 계정이 비활성화 됩니다.'.format(attempts)})
        else:
            # 인증이 성공한 경우 로그인 처리
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key,'is_logined': '1', 'user': user.user_id, 'username':user.username}) 

class LogoutView(APIView):
    def get(self, request, format=None):
        # 유저에 연결된 토큰을 가져옵니다
        try:
            token = Token.objects.get(user=request.user)
        except Token.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

 

        # 토큰을 삭제합니다
        token.delete()
        return Response(status=status.HTTP_200_OK)

    
# 네이버 SMS 인증
class SmsSendView(APIView):
    def send_sms(self, phone_number, auth_number):
        timestamp = str(int(time.time() * 1000))  
        headers = {
            'Content-Type': "application/json; charset=UTF-8", # 네이버 참고서 차용
            'x-ncp-apigw-timestamp': timestamp, # 네이버 API 서버와 5분이상 시간차이 발생시 오류
            'x-ncp-iam-access-key': 'ufogbKf7Huu2dSx2ne2e',
            'x-ncp-apigw-signature-v2': make_signature(timestamp) # utils.py 이용
        }
        body = {
            "type": "SMS", 
            "contentType": "COMM",
            "from": "01025157334", # 사전에 등록해놓은 발신용 번호 입력, 타 번호 입력시 오류
            "content": f"[인증번호:{auth_number}]", # 메세지를 이쁘게 꾸며보자
            "messages": [{"to": f"{phone_number}"}] # 네이버 양식에 따른 messages.to 입력
        }
        body = json.dumps(body)
        requests.post('https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:309926176922:oruwan/messages', headers=headers, data=body)
        
    def post(self, request):
        try:
            input_mobile_num = request.data.get("phone_number")
            auth_num = random.randint(10000, 100000) # 랜덤숫자 생성, 5자리로 계획하였다.
            auth_mobile = Authentication.objects.get(phone_number=input_mobile_num)
            auth_mobile.auth_number = auth_num
            auth_mobile.save()
            self.send_sms(phone_number=input_mobile_num, auth_number=auth_num)
            return Response({'is_ok': "1", 'message': '인증번호 발송완료'}, status=200)
        except Authentication.DoesNotExist: # 인증요청번호 미 존재 시 DB 입력 로직 작성
            Authentication.objects.create(
                phone_number=input_mobile_num,
                auth_number=auth_num,
            ).save()
            self.send_sms(phone_number=input_mobile_num, auth_number=auth_num)
            return Response({'is_ok': "1", 'message': '인증번호 발송 및 DB 입력완료'}, status=200)

# 네이버 SMS 인증번호 검증
class SMSVerificationView(APIView):
    def post(self, request):
        data = request.data

        try:
            verification = Authentication.objects.get(phone_number=data['phone_number'])

            if verification.auth_number == data['auth_number']:
                return Response({'is_verified': '1', 'message': '인증 완료되었습니다.'}, status=200)

            else:
                return Response({'is_verified': '0', 'message': '인증에 실패하셨습니다. 다시 시도해주세요'}, status=200)

        except Authentication.DoesNotExist:
            return Response({'message': '해당 휴대폰 번호가 존재하지 않습니다.'}, status=400)

