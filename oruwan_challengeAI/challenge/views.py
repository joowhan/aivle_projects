import os
from rest_framework import generics, mixins
from rest_framework.response import Response
from .models import Challenge, UserChallenge ,ChallengeStatus
from oruwanaccount.models import User
from .serializers import ChallengeSerializer, UserChallengeSerializer , RegisterUserChallengeSerializer, ChallengeStatusSerializer, ChallengeDayStatusSerializer, DetectAISerializer, RecommendAISerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from django.utils import timezone
from django.db.models import F, ExpressionWrapper, FloatField, When, Case


import tensorflow as tf
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import custom_object_scope
import tensorflow_hub as hub
from datetime import timedelta, datetime

from .recommend import recommend_chal
import pandas as pd
import tensorflow as tf
from transformers import TFBertForSequenceClassification, BertTokenizer
import numpy as np
from tqdm import tqdm
import re
import random
from datetime import datetime, date
from rest_framework.views import APIView

##List(목록) / Create(생성)
class ChallengeListAPI(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Challenge.objects.all().order_by('id')
    serializer_class = ChallengeSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
         return self.create(request)
     
##Detail(상세) / Update(수정) / Delete(삭제) / Retrieve(조회)  
class ChallengeDetailAPI(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    authentication_classes = [TokenAuthentication]
    # IsAdminUser: Staff User에 대해서만 요청 허용 (User.is_staff가 True여야 함)
    permission_classes = [IsAdminUser]
    
    
    queryset = Challenge.objects.all().order_by('id')
    serializer_class = ChallengeSerializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

# 참여가능 챌린지 리스트(구현 완료)
# join_count를 기준으로 참여하고 있는 챌린지 빼고 리스트 불러오기
class JoinableChallengeListAPI(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    authentication_classes = [TokenAuthentication]

    permission_classes = [IsAuthenticated]

    queryset = Challenge.objects.all().order_by('join_count')
    serializer_class = ChallengeSerializer

    def get(self, request, *args, **kwargs):
        excluded_values = UserChallenge.objects.values_list('challenge__challenge_name', flat=True)

        # 특정 값을 제외한 전체 리스트를 가져옵니다.
        # __in은 필드값이 주어진 리스트나 쿼리셋에 포함된경우를 의미함
        queryset = self.get_queryset().exclude(challenge_name__in=excluded_values)

        return self.list(request, *args, **kwargs)



class JoinableChallengeDetailAPI(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = Challenge.objects.all().order_by('join_count')
    serializer_class = ChallengeSerializer  # 사용할 시리얼라이저를 지정


    def get_serializer_class(self):
        print(self.request.data)
        print(self.request.data)
        if self.request.method == 'POST':
            return RegisterUserChallengeSerializer
        return self.serializer_class

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        challenge_id = kwargs.get('pk')  # URL의 'id' 값을 가져옴
        challenge_status_exists = UserChallenge.objects.filter(user=request.user, challenge_id = challenge_id).exists() 
        
        if challenge_status_exists: # 이미 ChallengeStatus가 존재하므로 새로 생성하지 않습니다 
            return Response({"is_register": False})
        
        else:
            challenge = Challenge.objects.get(id=challenge_id)
            challenge.join_count += 1
            challenge.prize += 10000
            challenge.save()
            
            user_id = self.request.user
            user = User.objects.all().get(username = user_id)
            user.user_money -= 10000
            user.save()
            return self.create(request, *args, **kwargs)

    
# 참여 중인 챌린지 리스트 
class JoinedChallengeListAPI(generics.GenericAPIView, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = UserChallengeSerializer

    def get_queryset(self):
        user = self.request.user
        
        current_date = timezone.now().date()

        # 이미 시작한 챌린지 가져오기
        # 사용자가 선택한 챌린지 가져오기 => 선택한 챌린지의 ID 목록 가져오기
        selected_challenge_ids = UserChallenge.objects.filter(user_id=user.user_id)


        # 참여 중인 챌린지 가져오기 (이미 시작한 챌린지에서 사용자가 선택한 챌린지)
        joined_challenges = UserChallenge.objects.filter(id__in=selected_challenge_ids, is_done=False)

        return joined_challenges

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
     


class JoinedChallengeDetailAPI(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Challenge.objects.all().order_by('join_count')
    serializer_class = ChallengeSerializer  # 사용할 시리얼라이저를 지정

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChallengeStatusSerializer
        return self.serializer_class
    
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        print(request.data)
        return self.create(request, *args, **kwargs)

class JoinedChallengeStatusListAPI(generics.GenericAPIView, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = ChallengeStatus.objects.all()
    serializer_class = ChallengeStatusSerializer  # 사용할 시리얼라이저를 지정
    
    def get(self, request, *args, **kwargs):
        queryset = self.queryset.filter(user=request.user)  # 현재 사용자가 등록한 챌린지만 가져오기 
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class JoinedChallengeStatusAPI(generics.GenericAPIView, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = ChallengeStatus.objects.all()
    serializer_class = ChallengeDayStatusSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ChallengeDayStatusSerializer
        return self.serializer_class
    
    def get(self, request, *args, **kwargs):
        user_challenge_id = self.kwargs.get('user_challenge_id')
        user_challenge = UserChallenge.objects.get(id=user_challenge_id)
        challenge_id = user_challenge.challenge_id
        user_id = user_challenge.user_id
        print(challenge_id)
        # Get the challenge total duration
        challenge_total_duration = Challenge.objects.filter(id=challenge_id).values('total_duration').first()['total_duration']
        print(challenge_total_duration)
        queryset = self.queryset.filter(user_challenge_id=user_challenge_id, user=request.user)

        
        # True인 is_success 필드 값들의 개수 구하기
        success_count = queryset.filter(is_success=True).count()
        # False인 is_success 필드 값들의 개수 구하기
        fail_count = queryset.filter(is_success=False).count()
        
        # Update the total_success_count and total_fail_count field with the calculated count
        queryset.update(total_success_count=success_count)
        queryset.update(total_fail_count=fail_count)
        
        # Calculate the success ratio
        queryset = queryset.annotate(
            success_percentage=ExpressionWrapper(
                (F('total_success_count') / challenge_total_duration) * 100,
                output_field=FloatField()
            )
        )
        
        # Calculate the fail ratio
        queryset = queryset.annotate(
            fail_percentage=ExpressionWrapper(
                (F('total_fail_count') / challenge_total_duration) * 100,
                output_field=FloatField()
            )
        )
        
        # Update the success_ratio field with the success_percentage value
        queryset.update(success_ratio=F('success_percentage'))
        
        # Update the fail_ratio field with the fail_percentage value
        queryset.update(fail_ratio=F('fail_percentage'))
        
        # Update the final_status field based on the fail_ratio value
        queryset.update(final_status=Case(
            When(fail_ratio__gt=20, then=False),
            default=True
        ))
        

        temp = ChallengeStatus.objects.filter(user_challenge_id=user_challenge_id, user=request.user).first()
        uc = UserChallenge.objects.filter(challenge_id=challenge_id, user=request.user).first()
        if temp and temp.final_status == False:
            uc.final_status = False
            uc.save()
        serializer = self.get_serializer(queryset, many=True)
        
        
        return Response(serializer.data)
    

    
# Detect AI
class DetectAIAPIView(mixins.CreateModelMixin, generics.GenericAPIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = DetectAISerializer
   
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 인공지능 모델에 전달할 데이터 추출
        input_data = request.FILES['field1']

        # 인공지능 모델 호출
        result = predict_with_model(input_data)
        class_idx = result[0]
        probability = result[1]
        
        user_id = request.data.get('user_id')
        challenge_id = request.data.get('challenge_id')
        challenge = Challenge.objects.get(id = challenge_id)
        user = UserChallenge.objects.filter(user_id=user_id)
        if user and class_idx == challenge.challenge_class_idx and probability >= 0.8:
            # challengeStatus 모델 업데이트
            try:
                challenge_status = ChallengeStatus.objects.get(user_id=user_id, challenge_id=challenge_id)
                challenge_status.is_success = True
                challenge_status.save()
            except ChallengeStatus.DoesNotExist:
                pass

            # UserChallenge 모델 업데이트
            try:
                user_challenges = UserChallenge.objects.filter(user=user_id, challenge=challenge_id)
                if user_challenges.exists():
                    user_challenge = user_challenges.first()
                    user_challenge.user_authenticated_fail_count = 0
                    user_challenge.status = True
                    user_challenge.save()
                    user_challenges.exclude(id=user_challenge.id).delete()
            except UserChallenge.DoesNotExist:
                pass
            return Response({'is_success': 'True'})
        else :
            try:
                challenge_status = ChallengeStatus.objects.get(user_id=user_id, challenge_id=challenge_id)
                challenge_status.is_success = False
                challenge_status.save()
            except ChallengeStatus.DoesNotExist:
                pass
            
            # UserChallenge 모델 업데이트
            try:
                user_challenges = UserChallenge.objects.filter(user=user_id, challenge=challenge_id)
                if user_challenges.exists():
                    user_challenge = user_challenges.first()
                    user_challenge.user_authenticated_fail_count += 1
                    user_challenge.status = False
                    user_challenge.save()
                    user_challenges.exclude(id=user_challenge.id).delete()
                
            except UserChallenge.DoesNotExist:
                pass
            return Response({'is_success': 'False', 'user_authenticated_count': user_challenge.user_authenticated_fail_count})



base_path = os.getcwd()
window_path1 = os.path.join(base_path, "model\\BiT_97.h5")
window_path2 = os.path.join(base_path, "model\\ResNet50_89.h5")
window_path3 = os.path.join(base_path, "model\\vgg16_89.h5")

norm_path1 = os.path.normpath(window_path1)
norm_path2 = os.path.normpath(window_path2)
norm_path3 = os.path.normpath(window_path3)

with custom_object_scope({'KerasLayer': hub.KerasLayer}):
    loaded_vit = load_model(norm_path1)
    ##resnet
    loaded_resnet = load_model(norm_path2)
    ##vgg-16
    loaded_vgg16 = load_model(norm_path3)

def predict_with_model(input_data):


    # 이미지 불러오기
    img = Image.open(input_data)

    # 이미지 전처리
    img = img.resize((224, 224))
    img = img.convert('RGB')
    data = np.asarray(img)
    data = data.reshape((1,) + data.shape)  # reshape the image

    # 모델들 예측 수행
    predictions = []
    models = [loaded_vit, loaded_resnet, loaded_vgg16]

    for model in models:
        prediction = model.predict(data)
        predictions.append(prediction)

    # 예측 확률들의 평균 계산
    ensemble_prediction = np.mean(predictions, axis=0)
    final_prediction = np.argmax(ensemble_prediction, axis=1)
    probability = np.max(ensemble_prediction)
    result = [final_prediction, probability]
    return result



# 모델 및 토크나이저 불러오기
model_name = "beomi/kcbert-base"
tokenizer = BertTokenizer.from_pretrained('model/bert_model/trained_model_tokenizer') # 토크나이저 경로 입력
model = TFBertForSequenceClassification.from_pretrained(model_name, num_labels=4)

#load model
model.load_weights('model/bert_model/trained_model_weights.h5') # 모델 경로 입력

class RecommnedAIAPIView(mixins.CreateModelMixin, generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RecommendAISerializer
   
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # 인공지능 모델에 전달할 데이터 추출
        reason = request.data.get('reason')
        user_id = request.data.get('user_id')
        challenge_id = request.data.get('challenge_id')
        
        user_challenge = UserChallenge.objects.get(user_id=user_id, challenge_id=challenge_id)
        challenge = Challenge.objects.get(id=challenge_id)
        if user_challenge.final_status == True:
            user_challenge.is_done = True
            user_challenge.save()
            challenge.certified_count +=1
            challenge.save()
            return Response({"message": "성공"})
        else:
            #################인공지능##########################
             # csv 파일을 DataFrame으로 읽어보기
            result = recommend_chal(reason, model, tokenizer, challenge_id)    # 수정 예정
            user_challenge.is_done = True
            user_challenge.save()
            if type(result) == type(1):
                return Response({"challenge_id": 0, "lable_id": 0})
            return Response({'challenge_id': result[0], 'lable_id': result[1]})


class CalculateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        current_date = date.today()

        try:
            user_challenge = UserChallenge.objects.filter(
                challenge__challenge_calculate_date__lt=current_date,
                user_id=request.data.get("user"),
                calculate_is_done=False
            ).select_related('challenge', 'user').get()
            challenge = user_challenge.challenge
            if user_challenge.is_done ==True and user_challenge.final_status == True and challenge.certified_count != 0:
                prize_per_certified = challenge.prize / challenge.certified_count
                user_challenge.user.user_money += prize_per_certified
                user_challenge.calculate_is_done = True
                user_challenge.user.save()
                user_challenge.save()
                return Response({"calculate_success" : True})
            elif user_challenge.is_done==True and user_challenge.final_status == False:
                user_challenge.calculate_is_done = True
                user_challenge.save()
                return Response({"calculate_success" : True})
            else:
                return Response({"calculate_success" : False})
        except:
            return Response({"calculate_success" :False})