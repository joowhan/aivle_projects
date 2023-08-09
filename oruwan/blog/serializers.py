from rest_framework import serializers
from .models import RoutineBlog, ChallengeBlog, RoutineComment, ChallengeComment, RoutineBlog

#Routine Part

class RoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutineBlog
        fields = '__all__'

##Routine_Create
class CreateRoutineBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutineBlog  
        fields = ['user','title', 'content', 'routine_blog_image']
        
##Routine_Comment
class RoutineCommentSerializer(serializers.ModelSerializer):
    parent_comment = serializers.PrimaryKeyRelatedField(queryset=RoutineComment.objects.all(), required=False, allow_null=True)   
         
    class Meta:
        model = RoutineComment
        fields = ['user', 'routine', 'comment', 'comment_count', 'created_at', 'parent_comment']  
              
 ##Routine_Popular_Blog
class RoutinePopularSerializer(serializers.ModelSerializer):    
    class Meta:
        model = RoutineBlog
        fields = ['title', 'content', 'created_at', 'routine_blog_image', 'user']       
        
        
#Challenge Part 

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeBlog
        fields = '__all__'   

##Challenge_Create
class CreateChallengeBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeBlog
        fields = ['user', 'title', 'content', 'challenge_blog_image']
        
##Challenge_Comment
class ChallengeCommentSerializer(serializers.ModelSerializer): 
    parent_comment = serializers.PrimaryKeyRelatedField(queryset=ChallengeComment.objects.all(), required=False, allow_null=True)   
    
    class Meta:
        model = ChallengeComment
        fields =  ['user', 'challenge', 'comment', 'comment_count', 'created_at', 'parent_comment']  
        
##Challenge_Popular_Blog
class ChallengePopularSerializer(serializers.ModelSerializer):    
    class Meta:
        model = ChallengeBlog
        fields = ['title', 'content', 'created_at', 'challenge_blog_image', 'user']     
    