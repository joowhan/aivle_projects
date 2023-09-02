import React from "react";
import { useNavigate } from "react-router-dom";

import "./Header.css";

// 아이콘 불러오기
import { FaArrowLeft } from "react-icons/fa";

const Header = props => {
    const navigate = useNavigate();

    return (
        <div id="appHeader" className="disable-text-selection">
            <div className="app_header__container left-align">
                <button
                    onClick={() => navigate(-1)}
                    className="app_header__btn"
                >
                    <FaArrowLeft size="1.5em" />
                </button>
            </div>
            <div className="app_header__container center-align">
                <span className="app_header__main-text">{props.title}</span>
            </div>
            <div className="app_header__container right-align"></div>
        </div>
    );
};

export default Header;
