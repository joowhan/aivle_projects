import React from "react";
import axios from "axios";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addChallenge, deleteChallenge } from "../../modules/myChallengeList";
import { useNavigate } from "react-router-dom";

// import styles from "./Main.module.css";
import "./Main.css";
// import "./Card.css";
import Header from "../../components/layouts/Header";
import Card from "./Card";
// import Scrolls from "./Scrolls";

import Nav from "../../components/layouts/Nav";
import ChallengeCard from "../../components/ChallengeCard";

// utils
import {
    parseTimeString,
    getCurrentTime,
    getCurrentDate,
    getCurrentDateString,
} from "../../utils/timeUtils";

const MainPage = props => {
    const navigate = useNavigate();

    // 오늘 날짜
    let today = new Date();
    let time = {
        year: today.getFullYear(), //현재 년도
        month: today.getMonth() + 1, // 현재 월
        date: today.getDate(), // 현제 날짜
        hours: today.getHours(), //현재 시간
        minutes: today.getMinutes(), //현재 분
    };

    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const challengeList = useSelector(state => state.myChallengeList);
    let dispatch = useDispatch();

    //챌린지 받아오는 부분 시작
    const [challengeCardList, setChallengeCardList] = useState([]);
    const [routines, setRoutines] = useState([]);

    const getChallenges = async () => {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
            `${baseUrl}/challenge/joinedchallenges/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        return response.data;
    };

    const getChallengeInfo = async challengeId => {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
            `${baseUrl}/challenge/joinedchallenges/${challengeId}/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        return response.data;
    };

    const fetchData = async () => {
        const data = await getChallenges();

        const cardList = [];
        // for loop 비동기 처리
        for await (const challengeData of data) {
            // 챌린지를 실패했다면 실패 및 피드백 화면으로 이동
            if (!challengeData.final_status) {
                navigate(`/challenge/fail/${challengeData.id}`, {
                    state: {
                        challengeId: challengeData.challenge,
                    },
                });
                break;
            } else {
                // 만료일에 하루를 더한 값을 만료 시간으로 설정
                const expiredDateString = challengeData.register_expired_date;
                const expiredDate = new getCurrentDate(
                    new Date(expiredDateString)
                );
                // 현재 시각이 만료일보다 크다면 결과화면으로 이동
                if (new Date() > expiredDate) {
                    console.log(challengeData.challenge_name);
                    navigate(`/challenge/result/${challengeData.id}`, {
                        state: {
                            challengeId: challengeData.challenge,
                        },
                    });
                    break;
                }
            }
            // 아니라면 아래와 같이 처리
            const resolve = await getChallengeInfo(challengeData.challenge);
            // 상태 불러오기 - 0:진행중, 1:성공, 2:실패, 3:아직 인증시간이 아님 9999:인증대기
            let state;
            if (challengeData.status === true) {
                state = 1;
            } else {
                if (challengeData.user_authenticated_fail_count >= 3) {
                    state = 9999;
                } else {
                    // 문자열을 Date 객체로 변환하여 처리 (utils/timeUtils.js 참고)
                    const startTime = parseTimeString(resolve.start_time);
                    const endTime = parseTimeString(resolve.end_time);
                    const currTime = getCurrentTime();
                    if (currTime < startTime) {
                        state = 3;
                    } else if (currTime > endTime) {
                        state = 2;
                    } else {
                        state = 0;
                    }
                }
            }
            cardList.push({
                id: resolve.id,
                title: resolve.challenge_name,
                message: resolve.challenge_content,
                state: state,
                startTime: resolve.start_time,
                endTime: resolve.end_time,
                userAuthenticatedFailCount:
                    challengeData.user_authenticated_fail_count,
                imageUrl: resolve.challenge_image,
            });

            dispatch(
                addChallenge({
                    id: resolve.id,
                    user_id: challengeData.id,
                    title: resolve.challenge_name,
                    content: resolve.challenge_content,
                    start_date: resolve.challenge_start_date,
                    end_date: resolve.challenge_expired_date,
                    register_start_date: challengeData.register_start_date,
                    register_expired_date: challengeData.register_expired_date,
                    duration: resolve.total_duration,
                    start_time: resolve.start_time,
                    end_time: resolve.end_time,
                    join_count: resolve.join_count,
                    certified_count: resolve.certified_count,
                    status: state,
                    today_fail_count:
                        challengeData.user_authenticated_fail_count,
                    total_fail_count: challengeData.user_total_fail_count,
                    image_url: resolve.challenge_image,
                    prize: resolve.prize,
                    guide: resolve.challenge_guide,
                    admin_challenge_image: resolve.admin_challenge_image,
                    no_admin_challenge_image: resolve.no_admin_challenge_image,
                })
            );
        }
        setChallengeCardList(current => (current = cardList));

        // 루틴 구간
        try {
            const token = sessionStorage.getItem("token");
            const dateString = getCurrentDateString();
            const response = await axios.post(
                `${baseUrl}/routine/routines/detail/`,
                {
                    user: sessionStorage.getItem("user"),
                    routine_start_date: dateString,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setRoutines(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useState(() => {
        // 로그인 안되어있을 때 fetch 하지 않음 (오류 방지)
        if (sessionStorage.getItem("user") != null) {
            if (challengeList.length > 0) {
                dispatch(deleteChallenge());
            }
            fetchData();
        }
    }, []);
    // 챌린지 불러오는 부분 끝

    const handleHeadlineClick = (data, idx) => {
        navigate("/challenge/proof/", { state: { idx: idx } });
    };

    if (sessionStorage.getItem("user") == null) {
        setTimeout(() => {
            alert("로그인이 필요합니다.");
            return navigate("/login");
        }, 1000);
    } else {
        return (
            <div id="mainContainer">
                <Header title="홈" />
                <p className="datetime">
                    {time.month}월 {time.date}일
                </p>
                <h1 className="headline__title">지금 인증 가능한 챌린지</h1>
                <div className="headline__scroll-container">
                    <ul className="headline__card-container">
                        {challengeCardList.map((data, index) => {
                            if (data.state === 0) {
                                return (
                                    <li className="headline__card-wrapper">
                                        <img
                                            className="headline__card-image"
                                            src={data.imageUrl}
                                        />
                                        <div className="headline__card__content-wrapper">
                                            <span className="headline__card__content-title">
                                                {data.title}
                                            </span>
                                            <span className="headline__card__content-description">
                                                인증가능시간
                                            </span>
                                            <span className="headline__card__content-time">
                                                {data.startTime.substring(0, 5)}{" "}
                                                ~ {data.endTime.substring(0, 5)}
                                            </span>
                                            <button
                                                className="headline__card__content-btn button button2"
                                                onClick={() => {
                                                    handleHeadlineClick(
                                                        data,
                                                        index
                                                    );
                                                }}
                                            >
                                                인증하기
                                            </button>
                                        </div>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                </div>
                <p className="home__subtitle">챌린지</p>
                <div className="challenge__wrapper">
                    <ul>
                        {challengeCardList.map((data, index) => (
                            <ChallengeCard
                                idx={index}
                                id={data.id}
                                title={data.title}
                                message={data.message}
                                state={data.state}
                                startTime={data.startTime}
                                endTime={data.endTime}
                                userAuthenticatedFailCount={
                                    data.userAuthenticatedFailCount
                                }
                            />
                        ))}
                    </ul>
                </div>
                <p className="home__subtitle">루틴</p>
                <div className="home__routine-wrapper">
                {routines.map(routine => (
                    <div
                        style={{}}
                        id="RoutineContainer"
                        className={`routineShow2 ${
                            routine.completed_routines ? "completed" : ""
                        }`}
                        key={routine.id}
                        onClick={() => {}}
                    >
                        {routine.routine_name}
                    </div>
                ))}
                </div>
                

                <Nav />
            </div>
        );
    }
};

export default MainPage;
