import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import "./RoutineAdd.css";

const RoutineAddPage = ({ baseUrl = "http://127.0.0.1:8000" }) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    const [routineName, setRoutineName] = useState(""); // 루틴 이름 상태
    const [startDate, setStartDate] = useState(""); // 시작 날짜 상태
    const [endDate, setEndDate] = useState(""); // 종료 날짜 상태
    const [startTime, setStartTime] = useState(""); // 시작 시간 상태
    const [endTime, setEndTime] = useState(""); // 종료 시간 상태
    const [weekdays, setWeekdays] = useState([]); // 요일 선택 상태
    const [openRoutineAddModal, setOpenRoutineAddModal] = useState(false);

    // 루틴 추가 함수
    const handleRoutineAdd = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/routine/routine_register/`,
                {
                    routine_name: routineName,
                    routine_start_date: startDate,
                    routine_end_date: endDate,
                    routine_start_time: startTime,
                    routine_end_time: endTime,
                    completed_routines: false,
                    cycle: "1",
                    user: user,
                    weekdays: weekdays,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                }
            );
            console.log(response.data); // 성공 시 서버 응답 데이터 확인
            navigate(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStartDateChange = e => {
        setStartDate(e.target.value);
        if (endDate < e.target.value) {
            setEndDate(e.target.value);
        }
    };

    const handleStartTimeChange = e => {
        setStartTime(e.target.value);
        if (endTime < e.target.value) {
            setEndTime(e.target.value);
        }
    };

    const toggleWeekday = weekday => {
        if (weekdays.includes(weekday)) {
            const updatedWeekdays = weekdays.filter(day => day !== weekday);
            setWeekdays(updatedWeekdays);
        } else {
            setWeekdays([...weekdays, weekday]);
        }
    };

    return (
        <div id="RoutineContainer">
            <button
                className="routineButton"
                onClick={() => setOpenRoutineAddModal(true)}
            >
                루틴 추가하기
            </button>
            <Modal
                className="modalAddRoutine"
                overlayClassName="overlayAddRoutine"
                isOpen={openRoutineAddModal}
                onRequestClose={() => setOpenRoutineAddModal(false)}
            >
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
                    루틴 추가하기
                </div>
                <div className="routineAddInfo-input">
                    <div div style={{ paddingRight: "10%" }}>
                        루틴 이름
                    </div>
                    <input
                        type="text"
                        className="routineName"
                        value={routineName}
                        onChange={e => setRoutineName(e.target.value)}
                    />
                </div>
                <div className="routineAddInfo-input">
                    <div style={{ paddingRight: "10%" }}>시작 날짜</div>
                    <input
                        type="date"
                        className="routineName"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>
                <div className="routineAddInfo-input">
                    <div div style={{ paddingRight: "10%" }}>
                        종료 날짜{" "}
                    </div>
                    <input
                        type="date"
                        className="routineName"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        min={startDate} // 시작 날짜 이후로만 선택 가능
                    />
                </div>
                <div className="routineAddInfo-input">
                    <div div style={{ paddingRight: "10%" }}>
                        시작 시간{" "}
                    </div>
                    <input
                        type="time"
                        className="routineName"
                        value={startTime}
                        onChange={handleStartTimeChange}
                    />
                </div>
                <div className="routineAddInfo-input">
                    <div div style={{ paddingRight: "10%" }}>
                        종료 시간{" "}
                    </div>
                    <input
                        type="time"
                        className="routineName"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        min={startTime} // 시작 시간 이후로만 선택 가능
                    />
                </div>
                <div className="routineAddInfo-input">
                    <div div style={{ paddingRight: "2%" }}>
                        요일
                    </div>
                    <button
                        className="dayButton"
                        onClick={() => toggleWeekday(0)}
                        style={{
                            background: weekdays.includes(0)
                                ? "#8CDFE4"
                                : "#dfdfdf",
                            marginRight: "3px",
                        }}
                    >
                        월
                    </button>
                    <button
                        className="dayButton"
                        onClick={() => toggleWeekday(1)}
                        style={{
                            background: weekdays.includes(1)
                                ? "#8CDFE4"
                                : "#dfdfdf",
                            marginRight: "3px",
                        }}
                    >
                        화
                    </button>
                    <button
                        className="dayButton"
                        onClick={() => toggleWeekday(2)}
                        style={{
                            background: weekdays.includes(2)
                                ? "#8CDFE4"
                                : "#dfdfdf",
                            marginRight: "3px",
                        }}
                    >
                        수
                    </button>
                    <button
                        className="dayButton"
                        onClick={() => toggleWeekday(3)}
                        style={{
                            background: weekdays.includes(3)
                                ? "#8CDFE4"
                                : "#dfdfdf",
                            marginRight: "3px",
                        }}
                    >
                        목
                    </button>
                    <button
                        className="dayButton"
                        onClick={() => toggleWeekday(4)}
                        style={{
                            background: weekdays.includes(4)
                                ? "#8CDFE4"
                                : "#dfdfdf",
                            marginRight: "3px",
                        }}
                    >
                        금
                    </button>
                    <button
                        className="dayButton"
                        onClick={() => toggleWeekday(5)}
                        style={{
                            background: weekdays.includes(5)
                                ? "#8CDFE4"
                                : "#dfdfdf",
                            marginRight: "3px",
                        }}
                    >
                        토
                    </button>
                    <button
                        className="dayButton"
                        onClick={() => toggleWeekday(6)}
                        style={{
                            background: weekdays.includes(6)
                                ? "#8CDFE4"
                                : "#dfdfdf",
                            marginRight: "3px",
                        }}
                    >
                        일
                    </button>
                </div>
                <button
                    className="routineAddInfo-inputButton"
                    onClick={handleRoutineAdd}
                    disabled={
                        !routineName ||
                        !startDate ||
                        !endDate ||
                        !startTime ||
                        !endTime
                    }
                    style={{
                        backgroundColor:
                            !routineName ||
                            !startDate ||
                            !endDate ||
                            !startTime ||
                            !endTime
                                ? "#dfdfdf"
                                : "#8CDFE4",
                    }}
                >
                    루틴 추가하기
                </button>
            </Modal>
        </div>
    );
};

export default RoutineAddPage;
