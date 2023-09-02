import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useCountUp } from "react-countup";
import { useSelector } from "react-redux";

import axios from "axios";

import "./ChallengeResult.css";
import CommonButton from "../../components/CommonButton";

const ChallengeResultPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { challengeId } = location.state;

    const token = sessionStorage.getItem("token");
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);

    const [btnUrl, setBtnUrl] = useState("");
    const [btnClass, setBtnClass] = useState("disabled");
    const [challengeData, setChallengeData] = useState({});

    const fetchChallenge = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/challenge/joinedchallenges/${challengeId}/`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            setChallengeData(response.data);
        } catch (error) {
            alert("서버에서 챌린지 정보를 받아오는 중 오류가 발생했습니다.");
            console.log(error);
        }
    };

    // 애니메이션 재생까지 1초간 버튼 비활성화
    useEffect(() => {
        fetchChallenge();
        setTimeout(() => {
            setBtnUrl(`/challenge/success/${id}`);
            setBtnClass("");
        }, 1000);
    }, []);

    // 0 ~ prize까지 3초간 카운트업
    useCountUp({
        ref: "counter",
        start: 0,
        end: challengeData.prize,
        duration: 3,
        delay: 1,
        suffix: "원",
        formattingFn: value => {
            return value.toLocaleString() + " 원";
        },
    });

    return (
        <div id="resultContainer">
            <div className="result-wrapper">
                <img
                    className="result-image"
                    src={challengeData.challenge_image}
                    alt="challenge image"
                />
                <h1 className="result-title">{challengeData.challenge_name}</h1>
                <div className="result__summary-title">총 상금</div>
                <span id="counter" className="result__summary-item">
                    0 원
                </span>
                <span className="result__summary-item"></span>
                <div className="result-description">챌린지가 종료되었어요</div>
                <div className="result-description">
                    결과를 확인하러 가볼까요?
                </div>
                <CommonButton
                    onClick={() => {
                        navigate(btnUrl, { state: { challengeId } });
                    }}
                    className={btnClass}
                    text="결과 보기"
                />
            </div>
        </div>
    );
};

export default ChallengeResultPage;
