import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { useSelector } from "react-redux";

import axios from "axios";

import "./ChallengeSuccess.css";
import CommonButton from "../../components/CommonButton";
import imagePath from "../../assets/images/target-iso-color.png";

const ChallengeSuccessPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const token = sessionStorage.getItem("token");

    const [btnClass, setBtnClass] = useState("disabled");
    const [challengeData, setChallengeData] = useState({});

    const location = useLocation();
    const { challengeId } = location.state;

    // 팡파레
    const { width, height } = useWindowSize();

    const fetchChallenge = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/challenge/joinedchallenges/${id}/`,
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );
            setChallengeData(response.data);
            setBtnClass("");
        } catch (error) {
            alert("서버에서 챌린지 정보를 받아오는 중 오류가 발생했습니다.");
            console.log(error);
        }
    };

    // 해당 챌린지가 처리되었음을 서버에 알리고 DB에 저장하는 코드
    // userId, challengeId, reason이 필요합니다. (reason은 형식상 필요하지만, 실제로는 사용되지 않음)
    const sendResult = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/challenge/recommendai/`,
                {
                    user_id: sessionStorage.getItem("user"),
                    challenge_id: challengeId,
                    reason: " ",
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            navigate("/");
        } catch (error) {
            alert("결과 처리에 실패했습니다.");
            console.log(error);
        }
    };

    useEffect(() => {
        fetchChallenge();
    }, []);

    return (
        <div id="successContainer">
            <Confetti width={width} height={height} />
            <img className="success-image" src={imagePath} />
            <h1 className="success-title">챌린지 성공!</h1>
            <div className="success-description">챌린지가 끝나도</div>
            <div className="success-description">루틴은 꾸준하게!</div>
            <div className="success-description"></div>
            <CommonButton
                className={btnClass}
                text="확인"
                onClick={sendResult}
            />
        </div>
    );
};

export default ChallengeSuccessPage;
