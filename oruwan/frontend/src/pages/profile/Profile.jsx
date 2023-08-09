import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Modal from "react-modal";
import axios from "axios";

import "./Profile.css";
import MoreInfoCard from "../../components/mypage/MoreInfoCard";
import Nav from "../../components/layouts/Nav";
import Header from "../../components/layouts/Header";
import AgreeDetailMarkdown from "../../components/auth/AgreeDetailMarkdown";
import NoticeMarkdown from "../../components/mypage/NoticeMarkdown";
import FAQMarkdown from "../../components/mypage/FAQMarkdown";
import ContactMarkdown from "../../components/mypage/ContactMarkdown";

const ProfileMainPage = () => {
    const navigate = useNavigate();
    // 유저 정보
    const username = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("user");
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const token = sessionStorage.getItem("token");

    // 모달 관련 설정
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // 유저가 수행한 챌린지 정보, 예치금 등 받아오기
    const [userInfo, setUserInfo] = useState({
        user_money: 0,
        challenge_status_success: 0,
        challenge_status_ing: 0,
        challenge_status_fail: 0,
    });

    const fetchUserInfo = async () => {
        const response = await axios.post(
            `${baseUrl}/mypage/mypage/`,
            {
                user_id: userId,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        setUserInfo(response.data);
    };

    useEffect(() => {
        const is_prize = localStorage.getItem("is_prize");

        if (is_prize === "true") {
            localStorage.setItem("is_prize", "false");

            navigate(0);
        }

        fetchUserInfo();
    }, []);

    // 유저 정보 중 보유 금액 파싱
    const parseUserMoney = moneyString => {
        const money = parseInt(moneyString);
        return `${money.toLocaleString()} 원`;
    };

    return (
        <div id="profileContainer">
            <Header title="마이 페이지" />
            <div className="profile__logout-wrapper">
                <Link className="profile__logout" to="/logout">
                    로그아웃
                </Link>
            </div>
            <section className="profile__section">
                <div className="profile__user-info__wrapper">
                    <h2 className="profile__user-info__title">개인정보</h2>
                    <div className="profile__user-info__content-wrapper">
                        <span className="profile__user-info__content-title">
                            닉네임
                        </span>
                        <span className="profile__user-info__content">
                            {username}
                        </span>
                    </div>
                </div>
            </section>

            {/* 예치금 및 챌린저 현황 카드 */}
            <section className="profile__section">
                <div className="profile__card-wrapper">
                    <div className="profile__card-content--large left-align">
                        예치금
                    </div>
                    <div className="profile__card-content--large center-align">
                        {parseUserMoney(userInfo.user_money)}
                    </div>
                </div>
                <div className="profile__card-wrapper">
                    <div className="profile__card-content black">챌린지</div>
                    <div className="profile__card-content center-align">
                        도전중
                    </div>
                    <div className="profile__card-content center-align">
                        성공
                    </div>
                    <div className="profile__card-content center-align">
                        실패
                    </div>
                    <div className="profile__card-content center-align black">
                        {userInfo.challenge_status_ing}
                    </div>
                    <div className="profile__card-content center-align emphasis">
                        {userInfo.challenge_status_success}
                    </div>
                    <div className="profile__card-content center-align strong">
                        {userInfo.challenge_status_fail}
                    </div>
                </div>
            </section>
            {/* 공지사항, 자주묻는 질문, 문의 등 */}
            <section className="profile__section">
                <div className="profile__board-wrapper">
                    <div className="profile__board-title">공지사항</div>
                    <MoreInfoCard
                        title="오루완 이야기"
                        content={<NoticeMarkdown />}
                    />
                </div>
                <div className="profile__board-wrapper">
                    <div className="profile__board-title">자주묻는 질문</div>
                    <MoreInfoCard
                        title="영양제 챌린지 할 때 알약만 되나요?"
                        content={<FAQMarkdown />}
                    />
                </div>
                <div className="profile__board-wrapper">
                    <div className="profile__board-title">문의</div>
                    <MoreInfoCard
                        title="문의하기"
                        content={<ContactMarkdown />}
                    />
                </div>
                <button
                    className="profile__modal-btn"
                    onClick={() => {
                        setModalIsOpen(true);
                    }}
                >
                    개인정보 처리방침
                </button>
            </section>
            <Nav />

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

export default ProfileMainPage;
