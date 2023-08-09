import string
from django.core.exceptions import ValidationError

def contains_special_character(value):
    for char in value:
        if char in string.punctuation:
            return True
    return False

def contains_uppercase_letter(value):
    return any(char.isupper() for char in value)

def contains_lowercase_letter(value):
    return any(char.islower() for char in value)

def contains_number(value):
    return any(char.isdigit() for char in value)

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if(
          len(password) < 8 or
          not contains_lowercase_letter(password) or
          not contains_number(password) or
          not contains_special_character(password)  
        ):
            raise ValidationError("8자 이상의 영문 대/소문자, 숫자, 특수문자 조합이어야 합니다.")
        
    def get_help_text(self):
        return "8자 이상의 영문 대/소문자, 숫자, 특수문자 조합을 입력해주세요.(get_help_text)"