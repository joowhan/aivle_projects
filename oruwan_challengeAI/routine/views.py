from django.shortcuts import render
from rest_framework import generics, mixins, status
from rest_framework.response import Response

from .models import Routine
from .serializers import RoutineSerializer
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta

# List(목록) Page
class RoutineAPI(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    #queryset = Routine.objects.all().order_by('id')
    serializer_class = RoutineSerializer
    
    def get_queryset(self):
        user = self.request.user
        joined_routines = Routine.objects.filter(user_id=user.user_id)
        return joined_routines
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    
from django.db.models import Q
##Detail(상세) Page => Update(수정) /  Retrieve(조회) 
class RoutineDetailAPI(generics.GenericAPIView, mixins.RetrieveModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = Routine.objects.all().order_by('routine_start_time')
    serializer_class = RoutineSerializer

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        routine_start_date = request.data.get('routine_start_date')

        joined_routines = Routine.objects.filter(user_id=user_id)

        if routine_start_date is not None:
            print("1")
            # 특정 날짜에 해당하는 루틴 가져오기
            requested_routines = joined_routines.filter(
                routine_start_date=routine_start_date
            )
            serializer = self.get_serializer(requested_routines, many=True)
        else:
            serializer = self.get_serializer(joined_routines, many=True)

        return Response(serializer.data)

     
# # Register(등록) Page
class RoutineRegisterAPI(generics.GenericAPIView, mixins.CreateModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = Routine.objects.all()
    serializer_class = RoutineSerializer
    
    def post(self, request):
        serializer = RoutineSerializer(data=request.data)
        if serializer.is_valid():
            # 인스턴스 생성을 위해 validated_data 가져오기
            validated_data = serializer.validated_data
            weekdays = request.data.get('weekdays')
            # 반복 주기 설정
            if validated_data['cycle'] >= 1:
                current_date = validated_data['routine_start_date']
                while current_date <= validated_data['routine_end_date']:
                    if current_date.weekday() in weekdays:  # 월, 수, 금, 일에 해당하는 요일 (0: 월, 2: 수, 4: 금, 6: 일)
                        new_routine = Routine.objects.create(
                            user=validated_data['user'],
                            routine_name=validated_data['routine_name'],
                            routine_start_date=current_date,
                            routine_end_date=current_date,
                            routine_start_time=validated_data['routine_start_time'],
                            routine_end_time=validated_data['routine_end_time'],
                            completed_routines=validated_data['completed_routines'],
                            cycle=1
                        )
                        new_routine.save()
                    current_date += timedelta(days=1)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
       

class RoutineDetailUpdateAPI(generics.GenericAPIView, mixins.RetrieveModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Routine.objects.all()
    serializer_class = RoutineSerializer

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        routine_id = request.data.get('routine_id')

        try:
            routine = Routine.objects.get(user_id=user_id, id=routine_id)
            if routine.completed_routines == False:
                routine.completed_routines = True
                routine.save()
            else:
                routine.completed_routines = False
                routine.save()
            serializer = self.get_serializer(routine)
            return Response(serializer.data)
        except Routine.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)   