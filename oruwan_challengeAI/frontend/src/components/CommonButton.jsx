import React from "react";
import "./CommonButton.css";
import { useNavigate } from "react-router-dom";

const CommonButton = ({
    onClick = () => {},
    idx,
    url = "",
    text,
    className = "",
}) => {
    const navigate = useNavigate();
    return (
        <div id="commonButtonContainer">
            <button
                onClick={() => {
                    if (url === "") {
                        onClick();
                    } else {
                        navigate(url, {
                            state: {
                                idx: idx,
                            },
                        });
                    }
                }}
                className={className + " common-btn"}
            >
                {text}
            </button>
        </div>
    );
};

export default CommonButton;
