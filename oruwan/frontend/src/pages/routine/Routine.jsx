import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "moment/locale/ko";
import RoutineAddPage from "./RoutineAdd";
import Header from "../../components/layouts/Header.jsx";
import Nav from "../../components/layouts/Nav";
import "./Routine.css";
// import 'react-calendar/dist/Calendar.css';

const RoutinePage = ({ baseUrl = "http://127.0.0.1:8000" }) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    const [selectedDate, setSelectedDate] = useState("");
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState({});
    const [openRoutineModal, setOpenRoutineModal] = useState(false);
    const todayMonth = moment().format("MM");
    const todayDay = moment().format("DD");

    const getRoutinesByDate = async selectedDate => {
        try {
            const response = await axios.post(
                `${baseUrl}/routine/routines/detail/`,
                {
                    user: user,
                    routine_start_date: selectedDate,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setRoutines(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRoutineClick = async routine => {
        try {
            const matchedRoutine = routines.find(r => r.id === routine.id);
            setSelectedRoutine(matchedRoutine);
            setOpenRoutineModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRoutineUpdate = async () => {
        try {
            await axios.post(
                `${baseUrl}/routine/routines/detail/update/`,
                {
                    user_id: user,
                    routine_id: selectedRoutine.id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                }
            );
            navigate(0);
            setOpenRoutineModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDateClick = date => {
        setSelectedDate(moment(date).format("YYYY-MM-DD"));
        getRoutinesByDate(moment(date).format("YYYY-MM-DD"));
    };

    useEffect(() => {
        setSelectedDate(moment().format("YYYY-MM-DD"));
        getRoutinesByDate(moment().format("YYYY-MM-DD"));
    }, []);

    const tileClassName = ({ date, view }) => {
        if (moment(date).isSame(moment(), "day")) {
            return "today";
        }
        if (view === "year") {
            return "transparentBackground boldText centerAlign";
        }
        return "customBackground"; // 배경 색상을 변경할 클래스를 추가합니다.
    };

    Modal.setAppElement("#root");

    return (
        <div id="routineContainer">
            <Header title="마이 루틴" />
            <div className="calendar">
                <div className="topname">
                    <div
                        className="topname-content2"
                        style={{
                            color: "#111",
                            fontSize: "1.2rem",
                            fontFamily: "Roboto",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "24px",
                            letterSpacing: "-0.4px",
                        }}
                    >
                        루틴
                    </div>
                    <div className="topname-content2"></div>
                    <div
                        className="topname-content2"
                        style={{ color: "#7676" }}
                    >
                        오루완
                    </div>
                    <div
                        className="topname-content2"
                        style={{ color: "#7676" }}
                    >
                        오늘루틴
                    </div>
                </div>
                <div className="topname">
                    <div className="topname-content2"></div>
                    <div className="topname-content2"></div>
                    <div
                        className="topname-content2"
                        style={{ color: "#19BEC9", fontWeight: "bold" }}
                    >
                        {
                            routines.filter(
                                routine => routine.completed_routines
                            ).length
                        }
                    </div>
                    <div
                        className="topname-content2"
                        style={{ color: "#111", fontWeight: "bold" }}
                    >
                        {routines.length}
                    </div>
                </div>
                <div style={{ marginBottom: "20px" }}></div>
                <Calendar
                    onClickDay={handleDateClick}
                    value={new Date()}
                    // 추가: calendar 클래스 적용
                    tileClassName={tileClassName}
                />
            </div>
            <div id="RoutineContainer">
                <div
                    style={{
                        color: "#111",
                        fontSize: "1.2rem",
                        fontFamily: "Roboto",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "-0.4px",
                    }}
                >
                    {todayMonth}월 {todayDay}일{" "}
                    {moment().locale("ko").format("dddd")}
                </div>
                <p></p>
                {routines.map(routine => (
                    <div
                        id="RoutineContainer"
                        className={`routineShow2 ${
                            routine.completed_routines ? "completed" : ""
                        }`}
                        key={routine.id}
                        onClick={() => handleRoutineClick(routine)}
                    >
                        {routine.routine_name}
                    </div>
                ))}
            </div>

            <Modal
                className="modalRoutine"
                overlayClassName="overlayRoutine"
                isOpen={openRoutineModal}
                onRequestClose={() => setOpenRoutineModal(false)}
            >
                {selectedRoutine && (
                    <div>
                        <div
                            style={{
                                color: "#111",
                                fontSize: "1.2rem",
                                fontFamily: "Roboto",
                                fontStyle: "normal",
                                fontWeight: 600,
                                lineHeight: "24px",
                                letterSpacing: "-0.4px",
                            }}
                        >
                            루틴
                        </div>

                        {/* 시작날짜와 종료날짜가 전체기간이 아닌 오늘로 불러와져서 우선 주석처리 했습니다.
            <div className="routineInfo-content">시작 날짜 : {selectedRoutine.routine_start_date}</div>
            <div className="routineInfo-content">종료 날짜 : {selectedRoutine.routine_end_date}</div>*/}
                        <div className="routineInfo-input">
                            <div style={{ paddingRight: "10%" }}>루틴 이름</div>
                            <div className="routineName">
                                {" "}
                                {selectedRoutine.routine_name}
                            </div>
                        </div>
                        <div className="routineInfo-input">
                            <div style={{ paddingRight: "10%" }}>시작 시간</div>
                            <div className="routineName">
                                {" "}
                                {selectedRoutine.routine_start_time}
                            </div>
                        </div>
                        <div className="routineInfo-input">
                            <div style={{ paddingRight: "10%" }}>종료 시간</div>
                            <div className="routineName">
                                {selectedRoutine.routine_end_time}
                            </div>
                        </div>
                        <div className="routineInfo-input">
                            <div div style={{ paddingRight: "10%" }}>
                                성공 여부
                            </div>
                            <div className="routineName">
                                {selectedRoutine.completed_routines
                                    ? "오늘 루틴 완료"
                                    : "오늘 루틴 아직"}
                            </div>
                        </div>
                        <button
                            className="routineInfo-Button"
                            onClick={handleRoutineUpdate}
                        >
                            {selectedRoutine.completed_routines
                                ? "루틴 완료 취소"
                                : "오늘 루틴 완료"}
                        </button>
                    </div>
                )}
            </Modal>

            <RoutineAddPage
                baseUrl={baseUrl}
                token={token}
                user={user}
                selectedDate={selectedDate}
                getRoutinesByDate={getRoutinesByDate}
            />
            <Nav />
        </div>
    );
};

export default RoutinePage;
