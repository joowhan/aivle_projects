import React, { useState } from "react";

import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import "./MoreInfoCard.css";

const MoreInfoCard = ({ title, content }) => {
    const [isHidden, setIsHidden] = useState(true);
    const [moreText, setMoreText] = useState("자세히");

    const toggleHidden = () => {
        setIsHidden(!isHidden);
        if (isHidden) {
            setMoreText("접기");
        } else {
            setMoreText("자세히");
        }
    };

    return (
        <div className="info-card__wrapper">
            <div className="info-card__title-wrapper">
                <div className="info-card__title">{title}</div>
                <div className="info-card__more" onClick={toggleHidden}>
                    {moreText}
                    {isHidden ? <BsChevronDown /> : <BsChevronUp />}
                </div>
            </div>
            <div
                className={`info-card__content-wrapper ${
                    isHidden ? "hidden" : ""
                }`}
            >
                {content}
            </div>
        </div>
    );
};

export default MoreInfoCard;
