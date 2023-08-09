import React from "react";

import "./Sidebar.css";

function Sidebar({ selectedCategory, handleCategoryChange }) {
    return (
        <div className="sidebar-wrapper">
            <button
                className={
                    selectedCategory
                        ? "sidebar__menu-btn selected"
                        : "sidebar__menu-btn"
                }
                onClick={handleCategoryChange}
            >
                <span className="sidebar__menu-text">루틴</span>
            </button>
            <button
                className={
                    selectedCategory
                        ? "sidebar__menu-btn"
                        : "sidebar__menu-btn selected"
                }
                onClick={handleCategoryChange}
            >
                <span className="sidebar__menu-text">챌린지</span>
            </button>
        </div>
    );
}

export default Sidebar;
