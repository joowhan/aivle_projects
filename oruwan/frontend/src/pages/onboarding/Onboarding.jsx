import React, { useEffect } from "react";
import $ from "jquery";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.min.js";

import "./Onboarding.css";

const Onboarding = () => {
    useEffect(() => {
        $(function () {
            $(".image").slick();
        });
    }, []);

    return (
        <div className="onboard1">
            <div className="sun-iso-color-parent">
                <img
                    className="sun-iso-color-icon"
                    alt=""
                    src="./img/sun.png"
                />
                <div className="group">
                    <div className="div3">루틴 어렵지 않아요</div>
                    <div className="div4">
                        <p className="p2">
                            루틴이라 하면 너무 어렵게 생각하는데
                        </p>
                        <p className="p2">누구나 쉽게 루틴을 만들 수 있어요</p>
                    </div>
                </div>
            </div>
            <div className="wrapper">
                <div className="div5">시작하기</div>
            </div>
        </div>
    );
};

export default Onboarding;
