import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

import "./ChallengeRecommend.css";

const ChallengeRecommendPage = () => {
    const token = sessionStorage.getItem("token");
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);

    const navigate = useNavigate();
    const location = useLocation();
    const { prevChallengeId, prevChallengeTitle, recommendId, category } =
        location.state;

    const [comportMessage, setComportMessage] = useState("");
    const [recommendData, setRecommendData] = useState({
        challenge_name: "",
    });

    // 추천된 챌린지 Id를 바탕으로 챌린지 정보를 가져옴
    const fetchRecommendData = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/challenge/joinablechallenges/${recommendId}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setRecommendData(response.data);
        } catch (error) {
            console.log(error);
            alert("챌린지 정보를 가져오는 것에 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchRecommendData();
        // ['기간' '시간' '어려움' '흥미도'] 0,1,2,3
        if (category == 0) {
            setComportMessage(
                "오랜 기간 동안 쉬지 않고 실천하는 것은 매우 어려운 일이랍니다. 조금씩 끊어서, 작지만 확실한 성취감을 느껴보는 것이 어떠신가요?"
            );
        } else if (category == 1) {
            setComportMessage(
                "일상에는 언제나 변수가 존재하는 법이랍니다. 정해진 시간에 하는 것도 중요하지만, 일단 잊지 않고 해냈다는 것이 더 중요한 것이 아닐까요?"
            );
        } else if (category == 2) {
            setComportMessage(
                "천리길도 한 걸음부터! 무리하지 않고, 조금씩 늘려가는 것이 목표 달성을 위한 비결이랍니다."
            );
        } else {
            setComportMessage(
                "하고 싶은 것을 억지로 하는 것이 괴롭지 않으신가요? 즐겁게, 자신의 흥미에 맞게 즐겁게 실천해보는 것은 어떠신가요?"
            );
        }
    }, []);

    return (
        <div id="recommendContainer">
            <div className="recommend__wrapper">
                <div className="recommend__paragraph-wrapper">
                    <p className="recommend__paragraph">{prevChallengeTitle}</p>
                    <p className="recommend__paragraph">
                        챌린지를 실패하셨군요!
                    </p>
                </div>
                <div className="recommend__paragraph-wrapper">
                    <p className="recommend__paragraph">{comportMessage}</p>
                </div>
                <div className="recommend__paragraph-wrapper">
                    <p className="recommend__paragraph">
                        <span className="emphasis">
                            {sessionStorage.getItem("username")}
                        </span>
                        을 오루완이 응원하며
                    </p>
                    <p className="recommend__paragraph">
                        다음 챌린지를 추천할게요!
                    </p>
                </div>
                <div className="recommend__paragraph-wrapper">
                    <p className="recommend__paragraph emphasis recommend__paragraph--title">
                        {recommendData.challenge_name}
                    </p>
                </div>
            </div>
            <button
                className="recommend__btn"
                onClick={() => {
                    navigate(`/challenge/detail/`, {
                        state: {
                            id: recommendId,
                        },
                    });
                }}
            >
                챌린지 바로가기
            </button>
            <button
                className="recommend__btn"
                onClick={() => {
                    navigate(`/challenge/fail/${prevChallengeId}`, {
                        state: {
                            challengeId: prevChallengeId,
                        },
                    });
                }}
            >
                실패 이유 한번만 더 고민하기
            </button>
        </div>
    );
};

export default ChallengeRecommendPage;
