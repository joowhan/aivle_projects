// hh:mm:ss 형식의 문자열을 시간으로 변환하는 함수
export const parseTimeString = timeString => {
    const [hour, minute, second] = timeString.split(":");
    return new Date(0, 0, 0, hour, minute, second);
};

// 날짜 없이 현재 시간만을 반환하는 함수
export const getCurrentTime = (dateTime = new Date()) => {
    return new Date(
        0,
        0,
        0,
        dateTime.getHours(),
        dateTime.getMinutes(),
        dateTime.getSeconds()
    );
};

// 시간 없이 날짜만을 반환하는 함수
export const getCurrentDate = (dateTime = new Date()) => {
    return new Date(
        dateTime.getFullYear(),
        dateTime.getMonth(),
        dateTime.getDate()
    );
};

// 두 Date 객체의 시간 차이를 반환하는 함수
export const getDiffTime = (end_date, start_date) => {
    const diff = end_date.getTime() - start_date.getTime();
    return diff;
};

// 현재 시각을 "YYYY-mm-dd" 문자열로 변환하는 함수
export const getCurrentDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
}