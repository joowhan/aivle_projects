# 그라운드 룰

## 일반

- 시작 후 15분, 끝나기 전 15분 - 짧게 스프린트 회의
  - 시작 전 : 오늘 할 일에 대해 협의
  - 끝나기 전 : 하루동안 어떤 것을 했는지 얘기하기
  - 월 시작 전/금 끝나기 전은 스프린트 주간 계획/회고 진행(탄력근무 계획) - 15분이 아니라 되는대로 진행
    - 월 시작 전 : 일주일 간 계획 및 대략적인 시간 이야기
    - 금 끝난 후 : 진도 체크, 추가 근무 필요하면 결정
- 조별 코칭, 그룹 코칭이 있는 날 (화, 목) 대면 진행
- 칼퇴 준수

## 코드 관련

- 주석 많이 달아주세요

## GitHub 관련

- 모든 작업은 본인 이름의 branch에서 진행 (main X)
- push가 완료되면 담당자에게 알려주고 PR(Pull Request) 생성하기
- 담당자가 코드 확인 후 merge
- 프로그램에 불필요한 테스트 코드(파일), 로그 등은 `.gitignore` 에 등록해서 main에 올라가지 않도록
  - 어떤 파일을 등록해야하는 지는 각자 검색해보기

## commit 규칙

`git commit -m “[Feat] commit messages”`

- Feat : 새로운 기능 추가, 기존의 기능을 요구 사항에 맞추어 수정
  - 어지간하면 다 feat 쓰시면 될듯 ㅎㅎ
- Fix : 기능에 대한 버그 수정
- Build : 빌드 관련 수정
- Chore : 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore
- Docs : 문서(주석) 수정
- Style : 코드 스타일, 포맷팅에 대한 수정
- Refactor : 기능의 변화가 아닌 코드 리팩터링 ex) 변수 이름 변경
- Release : 버전 릴리즈
- Merge : 병합
- `[Feat]` ← 이런식으로 맨 앞에 붙이고 뒤에 메세지는 자유롭게 작성

### PR

- 뭔가 복잡하다 싶으면 설명 작성해주세요!

# 코딩컨벤션

## Django

### 01. Code lay-out

- 인덴트(Indent): 공백으로 4칸 들여쓰기

- Blank Lines
  - 함수 및 클래스 정의 위에는 빈 2줄
  - 클래스 내의 메소드 정의에는 1줄씩 빈 줄

### 02. Whitespace in Expressions and Statements

- 불필요한 공백 넣지 않기
  - 대괄호[], 소괄호() 안
  - 쉼표(,), 쌍점(:)과 쌍반점(;) 앞

### 03. Comments

- 코드와 맞지 않는 주석 없도록 하기(항상 최신의 코드내용 상태로 유지)

- 불필요한 주석 달지 않기

- 명령문과 같은줄에 있는 인라인 주석은 많지 않도록 하기

### 04. Naming Conventions

- 피해야 하는 이름 : 'l'(소문자), 'O'(대문자) 또는 'I'(대문자) 단일 변수
  - 숫자 1, 0과 구별하기가 어렵기 때문
- 이름 정하기
  - 모듈 명은 짧은 소문자로
  - 클래스 명은 카멜케이스(CamelCase)로 작성
  - 함수명은 스네이크 케이스(snake_case)로
  - 인스턴스 메소드의 첫 번째 인수는 항상 self
  - 클래스 메소드의 첫 번째 인수는 항상 cls
  - 상수(Constant)는 모듈 단위에서만 정의, 모두 대문자

## React

### 네이밍 컨벤션

1. Components(클래스, 모듈 등) : PascalCase
2. Non-Components(함수 등) : camelCase
   - 일반 JavaScript 코드 또는 비-React UI 요소
     - Javascript 함수
     - Javascript 객체
     - HTML 요소
3. 속성명 : camelCase
4. inline style : camelCase -> 되도록 지양해주세요

### 코드 작성 규칙

1. spread 연산자 사용 (`...`)
   - 어짜피 이거 저희 쓸 일 없을듯?
2. `let`과 `const`만 사용 (var X)
3. 되도록 화살표 함수 사용
   - `const myFunction() => {};`
4. null check는 option chaning 연산자 (`?.`)를 사용
