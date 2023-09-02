import React from "react";
import "./StickyButton.css";
import { useNavigate } from "react-router-dom";

const StickyButton = ({
    onClick = () => {},
    idx,
    url = "",
    text,
    className = "",
}) => {
    const navigate = useNavigate();
    return (
        <div id="stickyButtonContainer">
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
                className={className + " sticky-btn"}
            >
                {text}
            </button>
        </div>
    );
};

export default StickyButton;
