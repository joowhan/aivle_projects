import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ChallengeImgCard.css";

const ChallengeImgCard = ({
    index, // 챌린지 Idx (백에서 넘겨받은 순서)
    id, // 챌린지 Id
    title,
    message,
    joinImg,
    isJoined,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <div className="challenge_img_card">
            <Link
                to={
                    isJoined === true
                        ? `/challenge/progress`
                        : `/challenge/detail`
                }
                state={{ index: index, id: id }}
            >
                <img
                    className="challenge_img_fluid_rounded"
                    alt={id}
                    src={joinImg}
                />
            </Link>
            <div className="challenge_card_content">
                <p
                    style={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginBottom: "1rem",
                        marginTop: "0.5rem",
                    }}
                    id="challenge_card_title"
                >
                    {title}
                </p>
                {isExpanded ? (
                    <p id="challenge_card_subtitle">{message}</p>
                ) : (
                    <p id="challenge_card_subtitle">
                        {isExpanded || message.length <= 50
                            ? message
                            : `${message.slice(0, 50)}...`}
                        {message.length > 50 && (
                            <button
                                style={{
                                    color: "#19BEC9",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                className="more_button"
                                onClick={handleToggleExpand}
                            >
                                {isExpanded ? "접기" : "더보기"}
                            </button>
                        )}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChallengeImgCard;
