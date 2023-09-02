from rest_framework import generics, mixins, status
from rest_framework.response import Response
from django.db.models import F, Count
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from .permissions import IsOwnerOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter

from django.core.files.storage import default_storage
from django.conf import settings
import os


from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import RoutineBlog, ChallengeBlog, RoutineComment, ChallengeComment
from .serializers import RoutinePopularSerializer, ChallengePopularSerializer, ChallengeSerializer , RoutineSerializer, CreateRoutineBlogSerializer, CreateChallengeBlogSerializer, ChallengeCommentSerializer, RoutineCommentSerializer 
from django.utils import timezone

from blog.pagination import CustomPagination


#Popular Blog
class RoutinePopularBlogListAPI(generics.GenericAPIView, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    #pagination
    pagination_class = CustomPagination
    
    filter_backends = [SearchFilter, OrderingFilter]
    
    # 검색 키워드를 지정했을 때, 매칭을 시도할 필드
    search_fields = ['title','content'] # ?search= -> QuerySet 조건 절에 추가할 필드 지정. 모델 필드 중에 문자열 필드만을 지정
    ordering_fields = ['like'] # ?ordering= -> 정렬을 허용할 필드의 화이트 리스트. 미지정 시에 serializer_class에 지정된 필드들
    ordering = ['like'] # 디폴트 정렬을 지정
    
    def get_queryset(self):
        # 인기 블로그를 가져와서 반환
        return RoutineBlog.objects.all()

    def get_serializer_class(self):
        return RoutinePopularSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class ChallengePopularBlogListAPI(generics.GenericAPIView, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    #pagination
    pagination_class = CustomPagination
    filter_backends = [SearchFilter, OrderingFilter]
    
    # 검색 키워드를 지정했을 때, 매칭을 시도할 필드
    search_fields = ['challenge','content'] # ?search= -> QuerySet 조건 절에 추가할 필드 지정. 모델 필드 중에 문자열 필드만을 지정.
    ordering_fields = ['like'] # ?ordering= -> 정렬을 허용할 필드의 화이트 리스트. 미지정 시에 serializer_class에 지정된 필드들.
    ordering = ['like'] # 디폴트 정렬을 지정
    
    def get_queryset(self):
        return ChallengeBlog.objects.all()

    def get_serializer_class(self):
        return ChallengePopularSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)   
    

# Routine Part

#List(목록)
class RoutineBlogListAPI(generics.GenericAPIView, mixins.ListModelMixin, mixins.UpdateModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = RoutineBlog.objects.all().order_by(F('id').desc())
    serializer_class = RoutineSerializer
    
    #pagination
    pagination_class = CustomPagination
    
    filter_backends = [SearchFilter]
    
    # 검색 키워드를 지정했을 때, 매칭을 시도할 필드
    search_fields = ['title', 'content'] # ?search= -> QuerySet 조건 절에 추가할 필드 지정. 모델 필드 중에 문자열 필드만을 지정

    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return RoutineSerializer
        return self.serializer_class

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

#Detail(상세) / Update(수정) / Delete(삭제) / Retrieve(조회)  

class RoutineBlogDetailAPI(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):

    # authentication_classes = [SessionAuthentication]
    authentication_classes = [TokenAuthentication]  
    permission_classes = [IsAuthenticated]

    queryset = RoutineBlog.objects.all().order_by('id')
    serializer_class = RoutineSerializer 

    def get(self, request, *args, **kwargs):

        routine_blog = self.get_object()
        # 클라이언트 IP 주소 가져오기

        ip_address = request.META.get('REMOTE_ADDR')
        # 해당 IP 주소로 조회수 데이터 가져오기

        # (생략) - IP 주소를 기록하거나 관리할 필요 없이, 바로 조회수 증가로 넘어갑니다.
        # 현재 시간과 마지막으로 조회수를 증가시킨 시간 비교
        if routine_blog.last_viewed_date.date() < timezone.now().date():
            # 조회수 초기화
            routine_blog.views = 1
            routine_blog.last_viewed_date = timezone.now()  # 마지막 조회수 증가 시간 업데이트
        else:
            # 조회수 증가
            routine_blog.views += 1
        routine_blog.save()
        
        user_id = request.GET["user_id"]
        pk = kwargs.get('pk')
        blog = RoutineBlog.objects.get(id =pk)
        like_cnt = blog.like_users.all().count()
        if blog.like_users.filter(user_id = user_id).exists():
            return Response({'is_exist': True,'views' : routine_blog.views, 'like_cnt': like_cnt})
        else:
            return Response({'is_exist': False,'views' : routine_blog.views, 'like_cnt': like_cnt})

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    
    def post(self, request, *args, **kwargs) :
        pk = kwargs.get('pk')
        routineblog = RoutineBlog.objects.get(id = pk)
        user_id = request.data.get('user_id')

        if routineblog.like_users.filter(user_id = user_id).exists():
            routineblog.like_users.remove(user_id)
            return Response({'is_exist': False, 'like_cnt' : routineblog.like_users.count()})

        else:
            routineblog.like_users.add(user_id)
            return  Response({'is_exist': True, 'like_cnt' : routineblog.like_users.count()})

    
#Create(생성)    
class RoutineBlogCreateAPI(generics.GenericAPIView, mixins.CreateModelMixin):
    authentication_classes = [TokenAuthentication]
    # authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = RoutineBlog.objects.all().order_by('id')
    serializer_class = CreateRoutineBlogSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 파일 추출
        file_obj = request.FILES.get('routine_blog_image')
        
        if not file_obj:
            return Response({"error": "routine_blog_image 파일이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)
        
        # 파일 저장
        file_path = os.path.join('routineblog', file_obj.name)
        file_path = default_storage.save(file_path, file_obj)

        # 파일 URL 생성
        ## 미디어 URL과 파일 경로를 조합하여 파일 URL 생성
        file_url = os.path.join(settings.MEDIA_URL, file_path)
        
        # RoutineBlog 객체 생성 및 저장
        routine_blog = RoutineBlog.objects.create(
            user=request.user,
            title=serializer.validated_data.get('title'),
            content=serializer.validated_data.get('content'),
            routine_blog_image=file_path,
        )
        
        return Response({"routine_blog_id": routine_blog.id,  "routine_blog_image_url": file_url}, status=status.HTTP_201_CREATED)
         
#Routine Comment
class RoutineBlogCommentAPI(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = RoutineCommentSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def get_queryset(self):
        routine_id = self.kwargs.get('routine_id') 
        routine_blog = get_object_or_404(RoutineBlog, id=routine_id)
        queryset = RoutineComment.objects.filter(routine=routine_blog).order_by(F('id').desc())
        return queryset

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise PermissionDenied

        blog = self.get_blog_object()
        parent_comment_id = request.data.get('parent_comment')
        parent_comment = None
        if parent_comment_id:
            parent_comment = get_object_or_404(RoutineComment, id=parent_comment_id)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, blog, parent_comment)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, blog, parent_comment=None):
        serializer.save(user=self.request.user, routine=blog, parent_comment=parent_comment)

    def get_blog_object(self):
        blog_id = self.kwargs.get('pk')
        blog = get_object_or_404(RoutineBlog, id=blog_id)
        return blog
 
class RoutineBlogCommentListAPI(generics.GenericAPIView, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = RoutineCommentSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def get_queryset(self):
        routine_id = self.kwargs.get('routine_id') 
        routine_blog = get_object_or_404(RoutineBlog, id=routine_id)
        queryset = RoutineComment.objects.filter(routine=routine_blog).order_by(F('id').desc())
        
        total_comment_count = queryset.count()
        queryset.update(comment_count=total_comment_count)
        
        return queryset

class RoutineBlogCommentDetailAPI(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    queryset = RoutineComment.objects.all().order_by('id')
    serializer_class = RoutineCommentSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)



#Challenge Part 

#List(목록) 
class ChallengeBlogListAPI(generics.GenericAPIView, mixins.ListModelMixin, mixins.UpdateModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = ChallengeBlog.objects.all().order_by(F('id').desc())
    serializer_class = ChallengeSerializer
    
    
    #pagination
    pagination_class = CustomPagination
     
    filter_backends = [SearchFilter]
    
    # 검색 키워드를 지정했을 때, 매칭을 시도할 필드
    search_fields = ['title', 'content'] # ?search= -> QuerySet 조건 절에 추가할 필드 지정. 모델 필드 중에 문자열 필드만을 지정.
    
    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return ChallengeSerializer
        return self.serializer_class
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

#Detail(상세) / Update(수정) / Delete(삭제) / Retrieve(조회)  
class ChallengeBlogDetailAPI(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):

    # authentication_classes = [SessionAuthentication]
    authentication_classes = [TokenAuthentication]  
    permission_classes = [IsAuthenticated]

    queryset = ChallengeBlog.objects.all().order_by('id')

    serializer_class = ChallengeSerializer

    def get(self, request, *args, **kwargs):

        challenge_blog = self.get_object()
        # 클라이언트 IP 주소 가져오기

        ip_address = request.META.get('REMOTE_ADDR')
        # 해당 IP 주소로 조회수 데이터 가져오기

        # (생략) - IP 주소를 기록하거나 관리할 필요 없이, 바로 조회수 증가로 넘어갑니다.
        # 현재 시간과 마지막으로 조회수를 증가시킨 시간 비교
        if challenge_blog.last_viewed_date.date() < timezone.now().date():
            # 조회수 초기화
            challenge_blog.views = 1
            challenge_blog.last_viewed_date = timezone.now()  # 마지막 조회수 증가 시간 업데이트
        else:
            # 조회수 증가
            challenge_blog.views += 1
        challenge_blog.save()

        # serializer = self.get_serializer(challenge_blog)
        user_id = request.GET["user_id"]
        pk = kwargs.get('pk')
        blog = ChallengeBlog.objects.get(id =pk)
        like_cnt = blog.like_challenge_users.all().count()
        if blog.like_challenge_users.filter(user_id = user_id).exists():
            return Response({'is_exist': True,'views' : challenge_blog.views, 'like_cnt': like_cnt})
        else:
            return Response({'is_exist': False,'views' : challenge_blog.views, 'like_cnt': like_cnt})

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def post(self, request, *args, **kwargs) :
        pk = kwargs.get('pk')
        challengeblog = ChallengeBlog.objects.get(id = pk)
        user_id = request.data.get('user_id')

        if challengeblog.like_challenge_users.filter(user_id = user_id).exists():
            challengeblog.like_challenge_users.remove(user_id)
            return Response({'is_exist': False, 'like_cnt' : challengeblog.like_challenge_users.count()})

        else:
            challengeblog.like_challenge_users.add(user_id)
            return  Response({'is_exist': True, 'like_cnt' : challengeblog.like_challenge_users.count()})

#Create(생성)   
class ChallengeBlogCreateAPI(generics.GenericAPIView, mixins.CreateModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = ChallengeBlog.objects.all().order_by('id')
    serializer_class = CreateChallengeBlogSerializer
    
        
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 파일 추출
        file_obj = request.FILES.get('challenge_blog_image')
        
        if not file_obj:
            return Response({"error": "challenge_blog_image 파일이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)
        
        # 파일 저장
        file_path = os.path.join('challengeblog', file_obj.name)
        file_path = default_storage.save(file_path, file_obj)

        # 파일 URL 생성
        ## 미디어 URL과 파일 경로를 조합하여 파일 URL 생성
        file_url = os.path.join(settings.MEDIA_URL, file_path)
        
        # RoutineBlog 객체 생성 및 저장
        challenge_blog = ChallengeBlog.objects.create(
            user=request.user,
            title=serializer.validated_data.get('title'),
            content=serializer.validated_data.get('content'),
            challenge_blog_image=file_path,
        )
        
        return Response({"challenge_blog_id": challenge_blog.id,  "challenge_blog_image_url": file_url}, status=status.HTTP_201_CREATED)

#Challenge Comment
class ChallengeBlogCommentAPI(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = ChallengeCommentSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def get_queryset(self):
        challenge_id = self.kwargs.get('challenge_id') 
        challenge_blog = get_object_or_404(ChallengeBlog, id=challenge_id)
        queryset = ChallengeComment.objects.filter(challenge=challenge_blog).order_by(F('id').desc())
        return queryset

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise PermissionDenied

        blog = self.get_blog_object()
        parent_comment_id = request.data.get('parent_comment')
        parent_comment = None
        if parent_comment_id:
            parent_comment = get_object_or_404(ChallengeComment, id=parent_comment_id)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, blog, parent_comment)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, blog, parent_comment=None):
        serializer.save(user=self.request.user, challenge=blog, parent_comment=parent_comment)

    def get_blog_object(self):
        blog_id = self.kwargs.get('pk')
        blog = get_object_or_404(ChallengeBlog, id=blog_id)
        return blog
    
class ChallengeBlogCommentListAPI(generics.GenericAPIView, mixins.ListModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = ChallengeCommentSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def get_queryset(self):
        challenge_id = self.kwargs.get('challenge_id') 
        challenge_blog = get_object_or_404(ChallengeBlog, id=challenge_id)
        queryset = ChallengeComment.objects.filter(challenge=challenge_blog).order_by(F('id').desc())
        
        total_comment_count = queryset.count()
        queryset.update(comment_count=total_comment_count)
        
        return queryset
    
class ChallengeBlogCommentDetailAPI(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    queryset = ChallengeComment.objects.all().order_by('id')
    serializer_class = ChallengeCommentSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)



    