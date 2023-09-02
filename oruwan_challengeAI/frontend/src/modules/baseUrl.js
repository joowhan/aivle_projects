// 액션 타입 만들기

// 액션 생성함수 만들기

// 초기 상태 선언
const initialState = {
    baseUrl: "http://127.0.0.1:8000",
};

// 리듀서 선언
export default function baseUrl(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}
