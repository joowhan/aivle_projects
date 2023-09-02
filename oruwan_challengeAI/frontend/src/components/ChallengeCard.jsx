import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChallengeCard.css";

const ChallengeCard = ({
    key,
    idx,
    id,
    title,
    message,
    state,
    startTime,
    endTime,
    userAuthenticatedFailCount,
}) => {
    const navigate = useNavigate();
    let parsedStartTime = startTime.split(":");
    let parsedEndTime = endTime.split(":");
    const [statusMessage, setStatusMessage] = useState("");
    const [statusClassName, setStatusClassName] = useState("state__pending");
    const [statusWrapper, setStatusWrapper] = useState("wrapper__pending");

    useEffect(() => {
        if (state === 9999) {
            setStatusMessage("관리자 검토중");
            setStatusClassName(current => (current = "state__review"));
            setStatusWrapper(current => (current = "wrapper__review"));
        } else if (state === 0) {
            setStatusMessage("인증 가능 시간");
            setStatusClassName(current => (current = "state__pending"));
            setStatusWrapper(current => (current = "wrapper__pending"));
        } else if (state === 1) {
            setStatusMessage("인증 성공");
            setStatusClassName(current => (current = "state__success"));
            setStatusWrapper(current => (current = "wrapper__success"));
        } else {
            setStatusMessage("인증 실패");
            setStatusClassName(current => (current = "state__fail"));
            setStatusWrapper(current => (current = "wrapper__fail"));
        }
    });
    const onClick = () => {
        navigate("/challenge/progress/", {
            state: {
                index: idx,
            },
        });
    };
    return (
        <li
            className={statusWrapper + " challenge-card__wrapper"}
            onClick={onClick}
        >
            <h1 className="challenge-card__title">{title}</h1>
            <div className="challenge-state__wrapper">
                <a className={statusClassName + " challenge-state__message"}>
                    {statusMessage}
                </a>
                <a
                    className={
                        statusClassName == "state__pending"
                            ? "challenge-state__time"
                            : "challenge-state__time hidden"
                    }
                >
                    {`${parsedStartTime[0]}:${parsedStartTime[1]}`} {" ~ "}
                    {`${parsedEndTime[0]}:${parsedEndTime[1]}`}
                </a>
            </div>
        </li>
    );
};

export default ChallengeCard;
