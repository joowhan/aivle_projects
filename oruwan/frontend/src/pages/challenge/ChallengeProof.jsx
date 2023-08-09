import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";

import axios from "axios";

import "./ChallengeProof.css";
import StickyButton from "../../components/StickyButton";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { changeStatusChallenge } from "../../modules/myChallengeList";

const ChallengeProofPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("user");
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const challengeData = useSelector(
        state => state.myChallengeList[location.state.idx]
    );
    console.log(challengeData);

    let image;
    const labelRef = useRef(null);
    const [source, setSource] = useState("");
    const [result, setResult] = useState("");
    const [imageClass, setImageClass] = useState(
        "proof-image proof-image--loading"
    );
    const [failCount, setfailCount] = useState(0);
    const [imageWrapperClass, setImageWrapperClass] = useState(
        "proof__image-wrapper proof__image-wrapper--loading"
    );
    useEffect(() => {
        if (labelRef.current && source == "") {
            labelRef.current.click();
        }
    });

    const reSendImage = () => {
        labelRef.current.value = null;
        labelRef.current.click();
    };

    const handleChange = event => {
        if (event.target.files.length > 0) {
            image = event.target.files[0];
            setSource(URL.createObjectURL(image));
            setResult("loading");

            sendImage(image);
        }
    };

    // 백엔드에 axios로 이미지 전송
    const sendImage = async image => {
        const formData = new FormData();
        formData.append("field1", image);
        formData.append("user_id", userId);
        formData.append("challenge_id", challengeData.id);
        try {
            const response = await axios.post(
                `${baseUrl}/challenge/detectai/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Token ${token}`,
                    },
                }
            );
            if (response.data.is_success === "True") {
                setResult("success");
                setImageClass("proof-image proof-image--success");
                setImageWrapperClass(
                    "proof__image-wrapper proof__image-wrapper--success"
                );
                dispatch(
                    changeStatusChallenge(
                        challengeData.id,
                        challengeData.status
                    )
                );
            } else {
                setResult("fail");
                setfailCount(response.data.user_authenticated_count);
                if (response.data.user_authenticated_count >= 3) {
                    setIsOpen(true);
                }
                setImageClass("proof-image proof-image--fail");
                setImageWrapperClass(
                    "proof__image-wrapper proof__image-wrapper--fail"
                );
            }
        } catch (error) {
            console.log(error);
            alert("이미지 전송에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 인증 성공했을 때 status에 성공 정보를 생성하기 위한 POST 요청
    const sendSuccess = async () => {
        const today = new Date();
        const todayString = `${today.getFullYear()}-${
            today.getMonth() + 1
        }-${today.getDate()}`;
        console.log(todayString);
        try {
            const response = await axios.post(
                `${baseUrl}/challenge/joinedchallenges/${challengeData.user_id}/`,
                {
                    challenge_today_date: todayString,
                    is_success: true,
                    challenge: challengeData.id,
                    user_challenge: challengeData.user_id,
                    user: userId,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            navigate("/challenge");
        } catch (error) {
            console.log(error);
            alert("챌린지 성공 요청에 실패했습니다.");
        }
    };

    // 모달창 관련 세팅
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%,-50%)",
        },
    };

    Modal.setAppElement("#root");

    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        navigate(-1);
    };

    return (
        <div id="challengeproofContainer">
            <label
                htmlFor="proofImage"
                className="proof__label"
                ref={labelRef}
            ></label>
            <input
                className="proof__input"
                id="proofImage"
                accept="image/*"
                type="file"
                capture="environment"
                onChange={handleChange}
            />
            {source && (
                <div className={imageWrapperClass}>
                    <img src={source} className={imageClass} />
                    {result == "loading" && (
                        <div className="lds-ellipsis">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    )}
                </div>
            )}
            {source && result == "loading" && (
                <div>
                    <strong className="proof__main-text">인증 중...</strong>
                    <div className="proof__description-text">
                        사진이 적합한지 <br /> 인공지능이 확인하고 있어요
                    </div>
                    <div className="proof__description-text">
                        조금만 기다려주세요!
                    </div>
                </div>
            )}
            {source && result == "success" && (
                // https://jsfiddle.net/sirhvd/6u9q7znc/ - Huy Vo
                <div className="alert-popup-container">
                    <div className="success-checkmark">
                        <div className="check-icon">
                            <span className="icon-line line-tip"></span>
                            <span className="icon-line line-long"></span>
                            <div className="icon-circle"></div>
                            <div className="icon-fix"></div>
                        </div>
                    </div>
                    <div className="alert-popup-title">오루완</div>
                    <div className="alert-popup-message">잘하고 계세요!</div>
                    <StickyButton text="확인" onClick={sendSuccess} />
                </div>
            )}
            {source && result == "fail" && (
                <div className="alert-fail-container">
                    <div className="proof-fail__title">인증 실패</div>
                    <div className="proof-fail__description">
                        가이드라인에 따라 정확한 사진을 찍어주세요!
                    </div>
                    <div className="proof-fail__guide-wrapper">
                        {/* TODO 인증 가이드 출력 */}
                        <div className="proof-fail__guide-title">
                            인증 가이드
                        </div>
                        <div className="proof-fail__guide-description">
                            가이드 내용이 들어갈 예정입니다
                        </div>
                    </div>
                    <div className="proof-fail__subguide-wrapper">
                        <span className="proof-fail__subguide-text">
                            인증에 문제가 생겼나요?
                        </span>
                        <a className="proof-fail__subguide-link">문의하기</a>
                    </div>
                    <StickyButton
                        idx={location.state.idx}
                        text={`다시 인증하기 ( ${failCount} / 3 ) 회`}
                        onClick={reSendImage}
                    />
                </div>
            )}
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    id="challengeproofModal"
                    className="ReactModal__Content"
                    shouldCloseOnOverlayClick={true}
                >
                    <AiOutlineExclamationCircle size={70} color="#ff7f00" />
                    <h2 className="modal__title">인증 횟수 초과</h2>
                    <div className="modal__description">
                        인증 횟수를 모두 사용하였습니다.
                    </div>
                    <div className="modal__description">
                        관리자 확인 후 승인됩니다.
                    </div>
                    <button onClick={closeModal} className="modal__btn">
                        확인
                    </button>
                </Modal>
            </div>
        </div>
    );
};

export default ChallengeProofPage;
