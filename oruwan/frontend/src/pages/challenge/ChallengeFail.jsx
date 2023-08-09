import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

import "./ChallengeFail.css";
import CommonButton from "../../components/CommonButton";

const ChallengeFailPage = () => {
    const navigate = useNavigate();
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const token = sessionStorage.getItem("token");

    // Main 페이지로부터 Challenge id를 넘겨 받음
    const location = useLocation();
    const { challengeId } = location.state;

    // 실패 피드백 정보에 사용
    const [challengeData, setChallengeData] = useState({});
    const [btnFucntion, setBtnFunction] = useState(() => {});
    const [btnClass, setBtnClass] = useState("disabled");
    const [inputValue, setInputValue] = useState("");
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // UserChallenge id를 이용해 Challenge 정보를 가져와 challengeData에 저장
    const fetchChallengeData = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/challenge/joinablechallenges/${challengeId}`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setChallengeData(response.data);
            }
        } catch (error) {
            console.log(error);
            alert("챌린지 정보를 가져오는 데 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchChallengeData();
    }, []);

    const sendResult = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/challenge/recommendai/`,
                {
                    user_id: sessionStorage.getItem("user"),
                    challenge_id: challengeId,
                    reason: inputValue,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            const recommendId = response.data.challenge_id; // 추천 받은 데이터
            const lable_id = response.data.lable_id;
            if (recommendId === 0) {
                setIsError(true);
                setErrorMessage("추천에 실패하였습니다. 다시 입력해주세요.");
                return;
            }
            navigate("/challenge/recommend/", {
                state: {
                    prevChallengeId: challengeData.id,
                    prevChallengeTitle: challengeData.challenge_name,
                    recommendId: recommendId,
                    category: lable_id,
                },
            });
        } catch (error) {
            alert("피드백 정보를 전송하는 것에 실패했습니다.");
            console.log(error);
        }
    };

    // 건너뛰기를 눌렀을 때
    const handleSkipClick = () => {
        // 실패 이유를 띄어쓰기 한 칸 문장으로 만들고 백엔드에 처리 요청 전송
        setInputValue(" ");
        handleBtnClick();
    };

    // 확인 버튼을 눌렀을 때
    const handleBtnClick = () => {
        // 확인 버튼을 눌렀을 때의 동작
        sendResult();
    };

    // Input 값을 변경했을 때
    const handelInputChange = event => {
        setInputValue(event.target.value);
        if (event.target.value.length > 0) {
            setBtnFunction(() => handleBtnClick);
            setBtnClass("");
        } else {
            setBtnFunction(() => {});
            setBtnClass("disabled");
        }
    };

    return (
        <div id="failContainer">
            <div className="fail__wrapper">
                <img
                    className="fail__image"
                    src={process.env.PUBLIC_URL + "/img/thumb-up-iso-color.png"}
                />
                <h1 className="fail__title emphasis">
                    {challengeData.challenge_name}
                </h1>
                <h1 className="fail__title">챌린지에 실패하셨습니다.</h1>
                <h1 className="fail__title">아쉬워요!</h1>
                <div className="fail__description">
                    챌린지 실패 이유를 입력해주면
                </div>
                <div className="fail__description">
                    오루완이 같이 고민 할게요!
                </div>
                <div className="fail__description"></div>
            </div>
            <div className="fail__wrapper">
                <input
                    className="fail__input"
                    type="text"
                    onChange={handelInputChange}
                    value={inputValue}
                    placeholder="20자 미만의 텍스트를 입력해주세요"
                    maxLength={20}
                />
            </div>
            <div className="fail__error__wrapper">
                <span className="fail__error__message" hidden={!isError}>
                    {errorMessage}
                </span>
            </div>
            <CommonButton
                className={btnClass}
                onClick={btnFucntion}
                text="확인"
            />
            <span className="fail__skip" onClick={handleSkipClick}>
                건너뛰기 {">"}
            </span>
        </div>
    );
};

export default ChallengeFailPage;
