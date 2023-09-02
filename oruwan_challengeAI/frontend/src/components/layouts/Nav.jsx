import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BiHomeAlt, BiConversation, BiUser } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { MdOutlinedFlag } from "react-icons/md";
import "./Nav.css";

const Nav = () => {
    const [isAlert, setIsAlert] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("is_prize") === "true") {
            setIsAlert(true);
        }
    }, []);

    return (
        <nav id="appNav">
            {/* NavLink를 사용하면 activeClassName, activeStyle이 활성화 됩니다. 이를 이용해 액티브 페이지 스타일을 지정할 수 있습니다. */}
            <div>
                <NavLink to="/">
                    <BiHomeAlt className="nav__icon" />
                </NavLink>
            </div>
            <div>
                <NavLink to="/challenge">
                    <MdOutlinedFlag className="nav__icon" />
                </NavLink>
            </div>
            <div>
                <NavLink to="/routine">
                    <FiClock className="nav__icon" />
                </NavLink>
            </div>
            <div>
                <NavLink to="/blog">
                    <BiConversation className="nav__icon" />
                </NavLink>
            </div>
            <div className="nav__profile-wrapper">
                <NavLink to="/profile">
                    <BiUser className="nav__icon" />
                </NavLink>
                <div className={`nav__alert ${isAlert ? "" : "hidden"}`}></div>
            </div>
        </nav>
    );
};
export default Nav;
