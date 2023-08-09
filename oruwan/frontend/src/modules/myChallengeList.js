// 액션 타입 선언
const ADD_CHALLENGE = "myChallengeList/ADD_CHALLENGE";
const CHANGE_STATUS_CHALLENGE = "myChallengeList/CHANGE_STATUS_CHALLENGE";
const ADD_TODAY_FAIL_COUNT = "myChallengeList/ADD_FALURE_COUNT";
const DELETE_CHALLENGE = "myChallengeList/DELETE_CHALLENGE";

// 액션 생성함수 선언
export const addChallenge = challenge => ({
    type: ADD_CHALLENGE,
    challenge: {
        id: challenge.id, // 챌린지의 고유 id
        user_id: challenge.user_id, // 유저가 챌린지를 등록할 때 발급되는 고유 id
        title: challenge.title,
        content: challenge.content,
        start_date: challenge.start_date,
        end_date: challenge.end_date,
        register_start_date: challenge.register_start_date, // 챌린지 등록 시작일
        register_expired_date: challenge.register_expired_date, // 챌린지 등록 종료일
        duration: challenge.duration, // 챌린지 기간
        start_time: challenge.start_time,
        end_time: challenge.end_time,
        join_count: challenge.join_count, // 총 참가자 수
        certified_count: challenge.certified_count, // 현재 실패하지 않은 참가자 수
        status: challenge.status, // 0:진행중, 1:성공, 2:실패, 9999:인증대기
        today_fail_count: challenge.today_fail_count, // 인증 실패 횟수
        total_fail_count: challenge.total_fail_count, // 총 인증 실패 횟수
        image_url: challenge.image_url, // 이미지 url
        prize: challenge.prize, // 챌린지 달성 시 상금
        guide: challenge.guide,
        admin_challenge_image: challenge.admin_challenge_image,
        no_admin_challenge_image: challenge.no_admin_challenge_image,
    },
});

export const changeStatusChallenge = (user_id, status) => ({
    type: CHANGE_STATUS_CHALLENGE,
    user_id,
    status,
});

export const addTodayFailCount = user_id => ({
    type: ADD_TODAY_FAIL_COUNT,
    user_id,
});

export const deleteChallenge = () => ({
    type: DELETE_CHALLENGE,
});

// 초기 상태 선언
const initialState = [
    /* 들어갈 데이터
        {
            "id": 1,
            "user_id": 1,
            "title": "챌린지 제목",
            "content": "챌린지 설명",
            "start_date": "2021-01-01",
            "end_date": "2021-01-31",
            "duration": 31, // 챌린지 기간
            "start_time": "00:00:00",
            "end_time": "23:59:59",
            "join_count": 1000, // 총 참가자 수
            "certificate_count": 980, // 현재 실패하지 않은 참가자 수
            "status": 0, // 0:진행중, 1:성공, 2:실패, 9999:인증대기
            "today_fail_count": 0, // 인증 실패 횟수
            "total_fail_count": 0, // 총 인증 실패 횟수
            "image_url": "https://i.pinimg.com/originals/0fb.jpg" // 이미지 url
            "prize": 100000 // 챌린지 달성 시 상금
        }
    */
];

// 리듀서 선언
export default function myChallengeList(state = initialState, action) {
    switch (action.type) {
        case ADD_CHALLENGE:
            return state.concat(action.challenge);
        case CHANGE_STATUS_CHALLENGE:
            return state.map(challenge =>
                challenge.id === action.id
                    ? { ...challenge, status: action.status }
                    : challenge
            );
        case ADD_TODAY_FAIL_COUNT:
            return state.map(challenge =>
                challenge.id === action.id
                    ? {
                          ...challenge,
                          today_fail_count: challenge.today_fail_count + 1,
                      }
                    : challenge
            );
        case DELETE_CHALLENGE:
            return state.filter(challenge => challenge.id === action.id);
        default:
            return state;
    }
}
