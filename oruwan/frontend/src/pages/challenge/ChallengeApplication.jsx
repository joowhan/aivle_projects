// ChallengeApplication.jsx

import React, { useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import "./ChallengeApplication.css";
import target from "./target.png";
import { getCurrentDate, getDiffTime } from "../../utils/timeUtils";

const ChallengeApplication = ({ isOpen, onRequestClose, onSubmit }) => {
    const [amount, setAmount] = useState(10000); // 초기 참가 금액 설정
    const [startDate, setStartDate] = useState(""); // 시작 날짜 설정
    const [dDay, setDDay] = useState(""); // D-day 설정
    const [dDaySign, setDDaySign] = useState("-"); // D-day 표시(+, -)

    const handleSubmit = () => {
        onSubmit(startDate);
        onRequestClose();
    };

    if (!isOpen) return null;

    const handleDecrease = () => {
        setAmount(prevAmount => prevAmount - 1000); // 1000원씩 감소
    };

    const handleIncrease = () => {
        setAmount(prevAmount => prevAmount + 1000); // 1000원씩 증가
    };

    const handleDateChange = event => {
        const selectedDate = getCurrentDate(new Date(event.target.value));
        setStartDate(event.target.value);
        calculateDDay(selectedDate);
    };

    const calculateDDay = selectedDate => {
        const today = getCurrentDate(new Date());
        // 오늘과 어제의 차이를 반환하는 함수
        const timeDiff = getDiffTime(selectedDate, today);
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 밀리초를 일수로 변환
        if (daysDiff > 0) {
            setDDaySign("+");
        } else {
            setDDaySign("-");
        }
        setDDay(Math.abs(daysDiff));
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="overlay"
            className="modalContainer"
        >
            <div className="modalContent">
                <p onClick={onRequestClose} className="closeBtn">
                    X
                </p>
                <div className="title">챌린지 참가</div>
                <div className="detail__summary-item">
                    <span className="detail__summary-title">D {dDaySign}</span>
                    <span className="detail__summary-value">{dDay}</span>
                </div>
                <div className="imageContainer">
                    <img src={target} alt="target" className="image" />
                </div>
                <div className="contentContainer">
                    <div className="detail__summary-item">
                        <span className="detail__summary-title">시작 날짜</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleDateChange}
                        />
                    </div>

                    <div className="detail__summary-item">
                        <span className="detail__summary-title">참가 금액</span>
                        <div className="amountContainer">
                            <button onClick={handleDecrease}>-</button>
                            <span className="amount">{amount}</span>
                            <button onClick={handleIncrease}>+</button>
                        </div>
                    </div>
                </div>
                <div className="joinButtonGroup">
                    <button className="joinButton" onClick={handleSubmit}>
                        챌린지 참가 신청
                    </button>
                </div>
            </div>
        </Modal>
    );
};

ChallengeApplication.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ChallengeApplication;
