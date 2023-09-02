import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

import "./ChallengeProgress.css";
import { HiOutlineArrowLeft } from "react-icons/hi";
import StickyButton from "../../components/StickyButton";

const ChallengeProgressPage = ({}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = sessionStorage.getItem("token");
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    // 저장소에서 데이터 받아옴
    const challengeData = useSelector(
        state => state.myChallengeList[location.state.index]
    );
    // 상금 파싱
    let prize;
    if (challengeData.prize >= 1000000) {
        prize =
            Math.floor(challengeData.prize / 10000).toLocaleString("ko-KR") +
            "만원";
    } else {
        prize = challengeData.prize.toLocaleString("ko-KR") + "원";
    }
    // useState 설정
    const [btnText, setBtnText] = useState("인증하기");
    const [btnClass, setBtnClass] = useState("");
    const [btnUrl, setBtnUrl] = useState("/challenge/proof/");

    // status 정보 받아오기
    const getStatus = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/challenge/joinedchallenges/status/${challengeData.user_id}/`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
        } catch (error) {
            console.log(error);
            alert("챌린지 상태를 가져오는 데 실패했습니다.");
        }
    };

    const onClick = () => {
        navigate(-1);
    };

    // 버튼 상태 구하기
    useEffect(() => {
        getStatus();
        if (challengeData.status === 1) {
            setBtnClass("disabled");
            setBtnUrl("");
            setBtnText("이미 인증한 챌린지입니다.");
        } else if (challengeData.status === 2) {
            setBtnClass("disabled");
            setBtnUrl("");
            setBtnText("챌린지 인증 가능한 시간이 아닙니다.");
        } else if (challengeData.statue === 9999) {
            setBtnClass("disabled");
            setBtnUrl("");
            setBtnText("관리자 승인 대기중입니다.");
        }
    });

    // 날짜 구하기
    const today = new Date();
    const registerStartDate = new Date(challengeData.register_start_date);
    const registerExpiredDate = new Date(challengeData.register_expired_date);
    const todayDiff = new Date(today.getTime() - registerStartDate.getTime());
    const durationDiff = new Date(
        registerExpiredDate.getTime() - registerStartDate.getTime()
    );

    const duration =
        Math.floor(durationDiff.getTime() / (1000 * 3600 * 24)) + 1; // 총 기간
    const todayIdx = Math.min(
        Math.floor(todayDiff.getTime() / (1000 * 3600 * 24)) + 1,
        duration - 1
    ); // 오늘은 며칠때인지

    // 챌린지 진행표 렌더링
    const renderProgressTable = () => {
        const result = [];
        let progressClassName;
        for (let i = 0; i < Math.max(duration, 7); i++) {
            if (i < todayIdx) {
                if (challengeData.status === 1) {
                    progressClassName = "progress__table-element--done";
                } else {
                    progressClassName = "progress__table-element--fail";
                }
            } else if (i >= duration) {
                progressClassName = "progress__table-element--none";
            } else if (i == todayIdx) {
                if (challengeData.status === 1) {
                    progressClassName = "progress__table-element--done";
                } else {
                    progressClassName = "progress__table-element--todo";
                    progressClassName += " progress__table-element--today";
                }
            } else {
                progressClassName = "progress__table-element--todo";
            }
            result.push(
                <div
                    key={i}
                    className={`progress__table-element ${progressClassName}`}
                ></div>
            );
        }
        return result;
    };

    return (
        <div id="challengeDetailContainer">
            <div className="detail__image-wrapper">
                <img
                    className="detail__image img-fluid rounded"
                    src={challengeData.image_url}
                    height={300}
                />
            </div>
            <div className="detail__wrapper">
                <div className="detail__header-wrapper">
                    <div className="left-align detail__header-wrapper--item">
                        <HiOutlineArrowLeft
                            className="detail__header-wrapper--icon"
                            onClick={onClick}
                        />
                    </div>
                    <h1 className="detail__title left-align detail__header-wrapper--item">
                        {challengeData.title}
                    </h1>
                    <div className="right-align detail__header-wrapper--item"></div>
                </div>
                <div className="detail__content-wrapper">
                    <div className="detail__summary-wrapper">
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                등록 기간
                            </span>
                            <span className="detail__summary__item">
                                {challengeData.register_start_date} ~{" "}
                                {challengeData.register_expired_date}
                            </span>
                        </div>
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                챌린지 기간
                            </span>
                            <span className="detail__summary__item">
                                {challengeData.duration}
                            </span>
                        </div>
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                참여인원
                            </span>
                            <span className="detail__summary__item">
                                {challengeData.join_count.toLocaleString(
                                    "ko-KR"
                                )}
                            </span>
                        </div>
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">주기</span>
                            <span className="detail__summary__item">매일</span>
                        </div>
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                인증시간
                            </span>
                            <span className="detail__summary__item detail__summary__time">
                                {challengeData.start_time.substring(0, 2)}시{" "}
                                <br />~ {challengeData.end_time.substring(0, 2)}
                                시
                            </span>
                        </div>
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                챌린지 상금
                            </span>
                            <span className="detail__summary__item detail__summary__prize">
                                {prize}
                            </span>
                        </div>
                    </div>
                </div>
                {/* 여기부터 챌린지 현황 */}
                <div className="separator"></div>
                <div className="progress-wrapper">
                    <h2 className="progress-title title">챌린지 참여 현황</h2>
                    <div className="progress__table-wrapper">
                        {renderProgressTable()}
                    </div>
                    <div className="progress-description description">
                        챌린지 3회 이상 미인증시 자동으로 탈락처리 되며, <br />{" "}
                        챌린지 참여금은 반환이{" "}
                        <span className="progress-description--strong description strong">
                            불가능
                        </span>{" "}
                        합니다.
                    </div>
                </div>
                <div className="guide-wrapper">
                    <h2 className="guide-title title">챌린지 참여 방법</h2>
                    <p className="detail__description__content">
                        {challengeData.guide}
                    </p>
                    <div className="detail__guide__example">
                        <div className="detail__guide__example-container">
                            <img
                                src={challengeData.admin_challenge_image}
                                alt="챌린지 인증 가이드 이미지"
                                className="detail__guide__example-image detail__guide__example-image--good"
                            />
                            <p className="detail__guide__example-text emphasis">
                                인증 가능 예시
                            </p>
                        </div>
                        <div
                            className="detail__guide__example-container"
                            style={{ marginLeft: "20px" }}
                        >
                            <img
                                src={challengeData.no_admin_challenge_image}
                                alt="챌린지 인증 가이드 이미지"
                                className="detail__guide__example-image detail__guide__example-image--bad"
                            />
                            <p className="detail__guide__example-text strong">
                                인증 불가능 예시
                            </p>
                        </div>
                    </div>
                    <div className="guide__content-wrapper"></div>
                </div>

                <StickyButton
                    url={btnUrl}
                    idx={location.state.index}
                    text={btnText}
                    className={btnClass}
                />
            </div>
        </div>
    );
};

export default ChallengeProgressPage;
