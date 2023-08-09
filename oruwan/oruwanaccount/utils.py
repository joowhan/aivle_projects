import hashlib
import hmac
import base64

def make_signature(timestamp):
    access_key = 'ufogbKf7Huu2dSx2ne2e'
    secret_key = 'h7xhaxwdmODPPep8UBFB6INR7b8LM2hrirCoz2QU'

    secret_key = bytes(secret_key, 'UTF-8')

    uri = "/sms/v2/services/ncp:sms:kr:309926176922:oruwan/messages"
    # uri 중간에 Console - Project - 해당 Project 서비스 ID 입력 (예시 = ncp:sms:kr:263092132141:sms)

    message = "POST" + " " + uri + "\n" + timestamp + "\n" + access_key
    message = bytes(message, 'UTF-8')
    signingKey = base64.b64encode(hmac.new(secret_key, message, digestmod=hashlib.sha256).digest())
    return signingKey