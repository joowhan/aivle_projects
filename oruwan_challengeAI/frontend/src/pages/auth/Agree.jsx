import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import "./Agree.css";
import AgreeMarkdown from "../../components/auth/AgreeMarkdown";
import AgreeDetailMarkdown from "../../components/auth/AgreeDetailMarkdown";
import Header from "../../components/layouts/Header";

const AgreePage = () => {
    const navigate = useNavigate();

    // 모달 관련 설정
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // 개인정보 수집 및 이용 동의 여부 체크
    const [agree, setAgree] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleChange = event => {
        setAgree(event.target.checked);
    };

    // 개인정보 수집 및 이용 동의를 했을 때만 다음 과정으로 넘어감
    const handleSubmit = () => {
        if (agree === true) {
            navigate("/auth");
        } else {
            setErrorMessage("개인정보 수집 및 이용에 동의해주세요.");
        }
    };

    return (
        <div id="agreeContainer">
            <Header title="사용자 동의" />
            <div className="agree__wrapper">
                <div className="agree__text--main">
                    개인정보 수집 및 이용 동의
                </div>
                <div className="agree__text">
                    {" "}
                    - 필수 항목은 서비스 제공을 위해 필요한 항목이므로, 동의를
                    거부하시는 경우 서비스 이용에 제한이 있을 수 있습니다.
                </div>
                <div className="agree__check-wrapper">
                    <div className="agree__check__input-wrapper">
                        <input
                            className="agree__check__checkbox"
                            type="checkbox"
                            onChange={handleChange}
                            checked={agree}
                        />
                        <div className="agree__check__input-text">
                            <span className="emphasis">[필수] </span>개인정보
                            수집 및 이용 동의
                        </div>
                    </div>
                    <div className="agree__markdown-wrapper">
                        <AgreeMarkdown />
                    </div>
                </div>
                <button
                    className="agree__detail-btn"
                    onClick={() => {
                        setModalIsOpen(true);
                    }}
                >
                    개인정보 처리방침 보기
                </button>
                <div className="agree__error-wrapper">
                    <span className="agree__error-message">{errorMessage}</span>
                </div>
                <button className="agree__join-btn" onClick={handleSubmit}>
                    회 원 가 입
                </button>
            </div>
            {/* 개인정보 처리 방침을 표시하는 모달 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => {
                    setModalIsOpen(false);
                }}
                className={"agree__detail__markdown-wrapper"}
                shouldCloseOnOverlayClick={true}
                style={{
                    overlay: {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                }}
            >
                <AgreeDetailMarkdown />
            </Modal>
            <button
                className={
                    modalIsOpen
                        ? "agree__detail-close-btn agree__detail-close-btn--open"
                        : "agree__detail-close-btn hidden"
                }
                onClick={() => {
                    setModalIsOpen(false);
                }}
            >
                닫 기
            </button>
        </div>
    );
};

export default AgreePage;
