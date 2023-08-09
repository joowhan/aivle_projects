import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

// css 적용 import
import "../../styles/reset.css";
import "./Verify.css";

// 컴포넌트
import Header from "../../components/layouts/Header.jsx";

const VerifyPage = () => {
    const navigate = useNavigate();
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const { state } = useLocation();

    const [minutes, setMinutes] = useState(5); // 5분 타이머 표시
    const [seconds, setSeconds] = useState(0);
    const [isError, setIsError] = useState(false); // 인증번호 오류 발생 시 true로 변경
    const [errorMessages, setErrorMessages] = useState("");

    let deadline = Date.now() + 1000 * 60 * 5; // 5분 후 시간
    let intervalID;

    // 타이머 표시, 5분 경과 시 만료 메세지 표시
    const getTime = () => {
        const time = deadline - Date.now();

        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));

        if (time < 1) {
            clearInterval(intervalID);
            setIsError(true);
            setErrorMessages("인증시간이 만료되었습니다. 재전송을 눌러주세요.");
        }
    };

    // 1초(1000ms)마다 타이머 갱신
    useEffect(() => {
        intervalID = setInterval(() => getTime(deadline), 1000);

        return () => clearInterval(intervalID);
    }, []);

    // 유효성을 만족할 경우에만 버튼 활성화
    const {
        register,
        handleSubmit,
        formState: { isDirty, isValid },
    } = useForm({ mode: "onChange" });

    // 인증번호 검증
    const onSubmit = async data => {
        const response = await axios.post(
            `${baseUrl}/api/smsverify/`,
            {
                phone_number: state.phoneNumber,
                auth_number: data.verifyNumber,
            },
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }
        );
        // 인증 성공시 회원가입 페이지로 이동, 실패시 전달받은 에러메세지 출력
        if (response.data.is_verified == "1") {
            alert(response.data.message);
            navigate("/register");
        } else {
            setIsError(true);
            setErrorMessages(response.data.message);
        }
    };

    // 인증번호 문자메세지 전송
    const onClickResendMessage = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/smssend/`,
                {
                    phone_number: state.phoneNumber,
                },
                {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            alert("인증번호가 발송되었습니다.");
            navigate("/verify", { state: { phoneNumber: state.phoneNumber } });
        } catch (error) {
            console.log(error);
            setIsError(true);
            setErrorMessages(
                "인증번호 발송에 실패했습니다. 다시 시도해주세요."
            );
        }
    };

    return (
        <div id="verifyContainer">
            <Header title="회원가입" />
            <div className="verify__wrapper">
                <div className="verify__text--main">
                    전송된 인증번호를 입력해주세요.
                </div>
                <div className="verify__text--sub">
                    본인 인증을 위해 필요합니다.
                </div>
                <form
                    onSubmit={handleSubmit(data => onSubmit(data))}
                    className="verify__form"
                >
                    <div
                        className={
                            isError
                                ? "verify-input__wrapper verify-input__wrapper--error"
                                : "verify-input__wrapper"
                        }
                    >
                        <input
                            className="verify-input"
                            id="verifyNumber"
                            type="number"
                            // 이렇게 해주어야 maxlength가 작동함
                            onInput={event => {
                                setIsError(false);
                                if (
                                    event.target.value.length >
                                    event.target.maxLength
                                )
                                    event.target.value =
                                        event.target.value.slice(
                                            0,
                                            event.target.maxLength
                                        );
                            }}
                            maxLength={5}
                            {...register("verifyNumber", {
                                required: true,
                                pattern: {
                                    value: /^\d{5}$/,
                                },
                            })}
                        />
                        <span className="verify__timer">
                            {minutes}:{seconds.toString().padStart(2, "0")}
                        </span>
                        <button
                            className="verify__resend"
                            onClick={onClickResendMessage}
                        >
                            재전송
                        </button>
                    </div>
                    <div className="verify__error-message" disabled={isError}>
                        {isError ? errorMessages : ""}
                    </div>
                    <button
                        className="verify-btn"
                        disabled={!isDirty || !isValid || isError}
                    >
                        확 인
                    </button>
                    <div className="verify__info-message">
                        인증번호가 오지 않았다면 차단번호 또는 스팸함을
                        확인해주세요.
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyPage;
