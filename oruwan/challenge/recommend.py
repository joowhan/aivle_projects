import tensorflow as tf
from transformers import TFBertForSequenceClassification, BertTokenizer
import numpy as np
import pandas as pd
from tqdm import tqdm
import re
import random
from datetime import datetime

# 특수 문자 제거
import re
def clean_text(text):

    pattern = '([ㄱ-ㅎㅏ-ㅣ]+)'  # 한글 자음, 모음 제거
    text = re.sub(pattern=pattern, repl='', string=text)

    text = re.sub('[^ ㄱ-ㅣ가-힣A-Za-z0-9]+', '', text)  # 특수문자 삭제

    text = re.sub(' +', ' ', text) # 중복된 공백 제거
    return text

# df['text'] = df['text'].apply(clean_text)

## 텍스트 전처리
def convert_examples_to_features(examples,tokenizer,max_seq_len=50):

    input_ids, attention_masks, token_type_ids = [], [], []

    for example in tqdm(examples, total=len(examples)):
        input_id = tokenizer.encode(example, max_length=max_seq_len, pad_to_max_length=True)
        padding_count = input_id.count(tokenizer.pad_token_id)
        attention_mask = [1] * (max_seq_len - padding_count) + [0] * padding_count
        token_type_id = [0] * max_seq_len

        assert len(input_id) == max_seq_len, "Error with input length {} vs {}".format(len(input_id), max_seq_len)
        assert len(attention_mask) == max_seq_len, "Error with attention mask length {} vs {}".format(len(attention_mask), max_seq_len)
        assert len(token_type_id) == max_seq_len, "Error with token type length {} vs {}".format(len(token_type_id), max_seq_len)

        input_ids.append(input_id)
        attention_masks.append(attention_mask)
        token_type_ids.append(token_type_id)

    input_ids = np.array(input_ids, dtype=int)
    attention_masks = np.array(attention_masks, dtype=int)
    token_type_ids = np.array(token_type_ids, dtype=int)

    return (input_ids, attention_masks, token_type_ids)





## 실패이유 0 (기간)
def reason_0(failed_total_duraction, failed_challenges,df):
    print('r0')
    rec_challenge = []
    # dic = {실패한 챌린지 기간 : arr index}
    dic = {28: 0, 14: 1, 7: 2, 3: 3, 5:3}
    # arr = [[추천해줄 기간]]
    arr = [[7, 14], [7,5], [3,5], [3]]

    # df.empty 빈 데이터프레임 확인, 비어있으면 True 반환

    # 3일짜리 실패했을 경우 3일짜리만 추천
    if failed_total_duraction == 3:
        flag = 0
        # 같은거 안 나올때까지 반복문 돌리기
        df = df[df['total_duration'].isin(arr[dic[failed_total_duraction]])]['id']
        if len(df) == 0:
            return [-9999]
        while flag == 0:
            rec_challenge = random.sample(df.tolist(), 1)
            # 실패한 챌린지랑 같지 않을때만 return
            if rec_challenge != failed_challenges:
                flag = 1
                return rec_challenge
    # 3일짜리 아닌거 실패했을때 추천
    else:
        # 실패한 챌린지보다 짧은 기간만 추천해줌
        df = df[df['total_duration'].isin(arr[dic[failed_total_duraction]])]['id']
        if len(df) == 0:
            return [-9999]
        rec_challenge = random.sample(df.tolist(), 1)
    return rec_challenge


## 실패이유 1 (시간)
def reason_1(start_time,failed_challenges,df):
    print('r1')
    # 시간 시간(hour)만 저장
    start_h = int(start_time.split(':')[0])
    # 낮에 하는 챌린지
    if start_h != 0 and start_h <= 12:
        df = df[(df['start_time'] > '12:00:00') | (df['start_time'] == '00:00:00')]
        if len(df) == 0:
            return [-9999] # 비어있음
        rec_challenge = random.sample(df.index.tolist(), 1)
    # 밤에하는 챌린지
    elif start_h != 0 and start_h >= 12:
        df = df[(df['start_time'] < '12:00:00') | (df['start_time'] == '00:00:00')]
        if len(df) == 0:
            return [-9999]
        rec_challenge = random.sample(df.index.tolist(), 1)
    # 하루종일 하는 챌린지
    else :
        flag=0
        # 실패했던거 아닌거 나올때까지 반복문 돌리기
        df = df[(df['start_time'] == '00:00:00')]
        if len(df) == 0:
            return [-9999]
        while flag ==0:
            rec_challenge = random.sample(df.index.tolist(), 1)
            if rec_challenge != failed_challenges:
                flag=1
                return rec_challenge

    return rec_challenge




## 실패이유 2 (어려움)
def reason_2(failed_challenges, df):
    print('r2')
    # 쉬운 챌린지 몇개만 추림
    df = df.loc[df['category'].isin([2,3])]
    # 챌린지 기간 3, 7, 14일짜리만 추림
    df = df.loc[df['total_duration'].isin([7,3,14])]
    # 추천되는게 실패한 챌린지와 안 겹칠때까지 반복문
    flag = 0
    if len(df) == 0:
        return [-9999]
    while flag == 0:
        rec_challenge = random.sample(df['id'].tolist(), 1)
        if rec_challenge != failed_challenges:
            flag = 1
            return rec_challenge

    return rec_challenge


## 실패이유 3 (흥미도)
def reason_3(category2, failed_total_duraction, failed_challenges, df):
    print('r3')
    # 동일한 카테고리 외의 챌린지를 추천해주기 위해 같은 동일한 카테고리 챌린지 제외
    df = df.loc[df['category'] != category2]
    # 실패한 챌린지 기간과 비교했을때 같거나 짧은 챌린지만 선택
    df = df.loc[df['total_duration'] <= failed_total_duraction]

    flag = 0
    # 추천되는게 실패한 챌린지와 안 겹칠때까지 반복문
    if len(df) == 0:
        return [-9999]
    while flag == 0:
        rec_challenge = random.sample(df['id'].tolist(), 1)
        if rec_challenge != failed_challenges:
            flag = 1
            return rec_challenge

    return rec_challenge

def recommend_chal(fail_reason, model, tokenizer,failed_challenges):
    # 실패 이유 text, model, 토크나이저, 실패한 챌린지 번호, csv 파일로 만든 DataFrame

    #######################################################################
    # 변수 설명

    # 받아와야하는 변수
    # fail_reason : 실패 이유 텍스트
    # failed_challenges : 실패한 챌린지 번호

    # 보내줄 변수
    # rec_challenge : 추천해줄 챌린지 번호

    # 실패 유형 클래스 : ['기간' '시간' '어려움' '흥미도'] 0,1,2,3
    # 챌린지 리스트 메인 페이지?로 전송해주는건 return 0
    # 조건에 맞는 챌린지가 없을때는 -9999 전송
    #######################################################################

    # 실패한 챌린지의 데이터 저장
    df = pd.read_csv('data.csv')
    failed_challenges= int(failed_challenges)
    print(failed_challenges)
    fail_data = df.loc[df['id'] == failed_challenges]
    fail_data.reset_index(inplace=True)
    # 실패한 챌린지의 기간
    print(fail_data.head())
    print("1")
    failed_total_duraction = fail_data['total_duration'][0]
    
    # 실패한 챌리지의 인증 시작 시간
    start_time = fail_data['start_time'][0]
    # 실패한 챌린지 카테고리
    category2 = fail_data['category'][0]

    # 현재 날짜(챌린지 실패한 날짜) 반환
    today = datetime.today()
    temp = str(today)
    today = temp.split()[0]

    # 실패한 날짜를 제외한 나머지 챌린지 데이터프레임
    df = df.loc[df['challenge_start_date'] <= today]
    df = df.loc[df['challenge_expired_date'] >= today]

    # 실패 이유를 리스트로 변환
    # fail_arr = [fail_reason]

    # 문장 전처리 부분
    fail_arr = [clean_text(fail_reason)]
    # 실패 이유 토크나이저 사용하여 변환
    fail_arr = convert_examples_to_features(fail_arr, tokenizer=tokenizer)

    # 실패유형 분류
    pred = model.predict(fail_arr)
    if np.max(pred[0]) < 5:
        rec_challenge = 0
        print('if',np.max(pred[0]))
        return rec_challenge
    else:
        label_pred = [np.argmax(y) for y in pred[0]]
        print('else',label_pred)

    # 실패 유형에 맞는 챌린지 추천 함수 실행
    if label_pred[0] == 0:
        answer = reason_0(failed_total_duraction, failed_challenges,df)
    elif label_pred[0] == 1:
        answer = reason_1(start_time,failed_challenges,df)
    elif label_pred[0] == 2:
        answer = reason_2(failed_challenges,df)
    else :
        answer = reason_3(category2, failed_total_duraction, failed_challenges, df)
    
    result = [answer[0], label_pred[0]]
    # 추천 챌린지 번호 보내줌
    return result