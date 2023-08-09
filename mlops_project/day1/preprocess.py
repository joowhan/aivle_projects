
import pandas as pd
import numpy as np

def preprocessing(data, s_imputer,cat, scaler, k_imputer, simpute_cols, x_cols) :
    # temp0 = test.copy()

    drop_cols = ['PassengerId','Ticket','Name',"Cabin"]
    # (1)불필요한 변수 삭제
    data1 = data.drop(drop_cols, axis = 1)

    # (2) NaN 조치
    data1[simpute_cols] = s_imputer.transform(data1[simpute_cols])

    # (3) FE
    data1['Family'] = data1['SibSp'] + data1['Parch'] + 1 
    data1.drop(['SibSp', 'Parch'], axis = 1, inplace = True)

    # (4) 가변수화
    for k, v in cat.items():
        data1[k] = pd.Categorical(data1[k], categories=v, ordered=False)
    data1 = pd.get_dummies(data1, columns =cat.keys(), drop_first = True)

    # (6) 스케일링
    x_val_s = scaler.transform(data1)

    # (7) NaN 조치2 : KNNImputer


    x_val_s = k_imputer.transform(x_val_s) 
    x_test = pd.DataFrame(x_val_s, columns = x_cols)


    return x_test


# def preprocessing(data, s_imputer, scaler, k_imputer, x_cols) :

#     drop_cols = ['PassengerId','Ticket','Name', 'Cabin']
#     data1 = data.drop(drop_cols, axis = 1)

#     # 칼럼추가
#     data1['Family'] = data1['SibSp'] + data1['Parch'] + 1
#     data1.drop(['SibSp', 'Parch'], axis = 1, inplace = True)

#     # NaN 조치 : 범주형 변수 최빈값으로 채우기
#     s_impute_cols = ['Embarked']
#     data1[s_impute_cols] = s_imputer.transform(data1[s_impute_cols])

#     # 가변수화
#     cat = {'Sex':["female", "male"]
#         , 'Embarked':["C", "Q", "S"]
#         , 'Pclass':[1,2,3]}

#     for k, v in cat.items():
#         data1[k] = pd.Categorical(data1[k], categories=v, ordered=False)

#     data1 = pd.get_dummies(data1, columns =cat.keys(), drop_first = 1)

#     # 스케일링
#     data1_s = scaler.transform(data1)

#     # NaN 조치
#     data1_s = k_imputer.transform(data1_s)
#     data1_s = pd.DataFrame(data1_s, columns = x_cols)
    
#     return data1_s
