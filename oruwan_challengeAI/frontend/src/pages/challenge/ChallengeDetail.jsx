import React, { useState, useEffect } from "react";
import Modal from "./ChallengeApplication";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { HiOutlineArrowLeft } from "react-icons/hi";
import "./ChallengeDetail.css";

const ChallengeDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useLocation().state;
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const token = sessionStorage.getItem("token");

    const [title, setTitle] = useState(null); // 챌린지 이름을 저장할 상태
    const [startDate, setStartDate] = useState(""); // 시작 날짜를 저장할 상태
    const [endDate, setEndDate] = useState(""); // 종료 날짜를 저장할 상태
    const [content, setContent] = useState(""); // 챌린지 설명을 저장할 상태
    const [joinCount, setJoinCount] = useState(0); // 참여 인원 수를 저장할 상태
    const [prize, setPrize] = useState(0); // 예치금을 저장할 상태
    const [imageUrl, setImageUrl] = useState("");
    const [guide, setGuide] = useState(""); // 챌린지 가이드를 저장할 상태
    const [adminImgUrl, setAdminImgUrl] = useState("");
    const [noAdminImgUrl, setNoAdminImgUrl] = useState("");
    const [total_duration, setDuration] = useState(""); // challenge_duration 상태 추가

    // 서버에서 데이터 가져오는 부분
    const getChallengeDetails = async () => {
        const response = await axios.get(
            `${baseUrl}/challenge/joinablechallenges/${id}/`, // 챌린지 ID에 맞게 경로 수정
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        return response.data;
    };

    //read data
    const fetchData = async () => {
        try {
            const data = await getChallengeDetails();

            // 서버에서 가져온 데이터를 각각의 상태에 설정
            setTitle(data.challenge_name);
            setStartDate(data.challenge_start_date);
            setEndDate(data.challenge_expired_date);
            setContent(data.challenge_content);
            setJoinCount(data.join_count);
            setPrize(data.prize);
            setImageUrl(data.challenge_image);
            setDuration(data.total_duration); // challenge_duration 상태 설정
            setGuide(data.challenge_guide);
            setAdminImgUrl(data.admin_challenge_image);
            setNoAdminImgUrl(data.no_admin_challenge_image);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [openModal, setOpenModal] = useState(false);
    const [isChallengeSubmitted, setIsChallengeSubmitted] = useState(false); // 챌린지 참가 신청 완료 여부

    const handleChallengeSubmit = async userSetStartDate => {
        const newDate = new Date(userSetStartDate);
        if (parseInt(total_duration) < 0) {
            alert("챌린지 기간을 다시 설정해주세요.");
            return;
        } else if (parseInt(total_duration) > 1) {
            const durationDate = new Date(0, 0, total_duration).getDate();
            newDate.setDate(newDate.getDate() + durationDate);
        }

        // 날짜를 yyyy-mm-dd 형식으로 변환
        const formattedDate = newDate.toISOString().split("T")[0];
        const formData = new FormData();

        formData.append("user", sessionStorage.getItem("user"));
        formData.append("challenge", id);

        formData.append("register_start_date", userSetStartDate);
        formData.append("register_expired_date", formattedDate);
        formData.append("user_register", true);
        const response = await axios.post(
            `${baseUrl}/challenge/joinablechallenges/${id}/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Token ${token}`,
                },
            }
        );
        setIsChallengeSubmitted(true); // 챌린지 참가 신청 완료 상태로 변경 , post 보내기
        navigate("/challenge");
    };
    return (
        <div id="challengeDetailContainer">
            <div className="detail__image-wrapper">
                <img
                    className="detail__image img-fluid rounded"
                    // src="https://images.unsplash.com/photo-1674574124349-0928f4b2bce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
                    src={imageUrl}
                    height={300}
                    alt="random image"
                />
            </div>
            <div className="detail__wrapper">
                <div className="detail__header-wrapper">
                    <div className="left-align detail__header-wrapper--item">
                        <HiOutlineArrowLeft
                            className="detail__header-wrapper--icon"
                            onClick={() => {
                                navigate("/challenge");
                            }}
                        />
                    </div>
                    <h1 className="detail__title left-align detail__header-wrapper--item">
                        {title}
                    </h1>
                    <div className="right-align detail__header-wrapper--item detail__header-wrapper--box"></div>
                </div>
                <div className="detail__content-wrapper">
                    <div className="detail__issue">마감 임박</div>
                    <div className="detail__summary-wrapper">
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                등록 가능 기간
                            </span>
                            <span className="detail__summary__item">
                                {startDate}
                                <br />
                                {endDate}
                            </span>
                        </div>
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                모집 마감
                            </span>
                            <span className="detail__summary__item">D-day</span>
                        </div>
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                참여인원
                            </span>
                            <span className="detail__summary__item">
                                {joinCount}
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
                            <span className="detail__summary__item">종일</span>
                        </div>
                        <div className="detail__summary__item-container">
                            <span className="detail__summary__title">
                                현재 예치금
                            </span>
                            <span className="detail__summary__item">
                                {prize * joinCount}
                            </span>
                        </div>
                    </div>
                    <div className="separator"></div>
                    <div className="detail__description">
                        <h2 className="detail__description__title">
                            챌린지 설명
                        </h2>
                        <p className="detail__description__content">
                            {content}
                        </p>
                    </div>
                    <div className="detail__guide">
                        <h2 className="detail__description__title">
                            인증 가이드
                        </h2>
                        <p className="detail__description__content">{guide}</p>
                        <div className="detail__guide__example">
                            <div className="detail__guide__example-container">
                                <img
                                    src={adminImgUrl}
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
                                    src={noAdminImgUrl}
                                    alt="챌린지 인증 가이드 이미지"
                                    className="detail__guide__example-image detail__guide__example-image--bad"
                                />
                                <p className="detail__guide__example-text strong">
                                    인증 불가능 예시
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="joinButtonGroup">
                {isChallengeSubmitted ? (
                    <button className="joinButton">
                        챌린지 참가 신청 완료
                    </button>
                ) : (
                    <button
                        className="joinButton"
                        onClick={() => setOpenModal(true)}
                    >
                        챌린지 참가 신청
                    </button>
                )}
            </div>
            <Modal
                ariaHideApp={false}
                isOpen={openModal}
                onRequestClose={() => setOpenModal(false)}
                onSubmit={handleChallengeSubmit}
                duration={total_duration}
            />
        </div>
    );
};

export default ChallengeDetailPage;
