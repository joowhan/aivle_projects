import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

//components
import Header from "../../components/layouts/Header.jsx";
//styles
import "./Login.css";
import { FaEnvelope, FaKey } from "react-icons/fa";

const LoginPage = () => {
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async data => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/login/`,
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            if (response.data.is_logined == "1") {
                sessionStorage.setItem("token", response.data["token"]);
                sessionStorage.setItem("user", response.data["user"]);
                sessionStorage.setItem("username", response.data["username"]);

                // 정산할 챌린지가 있다면, 정산 수행
                if (localStorage.getItem("is_prize") === null) {
                    localStorage.setItem("is_prize", false);
                }
                const calculateResponse = await axios.post(
                    `${baseUrl}/challenge/calculate/`,
                    {
                        user: sessionStorage.getItem("user"),
                    },
                    {
                        headers: {
                            Authorization: `Token ${sessionStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                // 사용자에게 정산 여부를 알리기 위해 is_prize를 localStorage에 저장
                if (calculateResponse.data.calculate_success === true) {
                    localStorage.setItem("is_prize", true);
                }
                alert("로그인 되었습니다.");
                navigate("/");
            } else {
                setErrorFlag(true);
                setErrorMessage(response.data.message);
            }
            // 백엔드에서 중복로그인 발생하면 raise함. 일단 모든 에러를 중복로그인으로 처리
        } catch (error) {
            setErrorFlag(true);
            setErrorMessage(
                "중복 로그인이 감지되었습니다. 다른 기기에서 로그아웃을 한 뒤 시도해주세요."
            );
        }
    };

    return (
        <div id="loginContainer">
            <Header title="로그인" />
            <form
                onSubmit={handleSubmit(data => onSubmit(data))}
                className="login_form"
            >
                <div className="login__wrapper">
                    <label htmlFor="email" className="login__label">
                        이메일
                    </label>
                    <div
                        className={
                            errors.email
                                ? "login__input__wrapper login__input__wrapper--error"
                                : "login__input__wrapper"
                        }
                    >
                        <FaEnvelope size="1.2em" />
                        <input
                            className="login__input"
                            id="email"
                            {...register("email", {
                                required: true,
                                pattern: {
                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                    message: "이메일 형식이 올바르지 않습니다.",
                                },
                            })}
                            placeholder="이메일"
                        />
                    </div>
                    {errors.email && (
                        <p className="login__error-message">
                            {errors.email.message
                                ? errors.email.message
                                : "이메일을 입력해주세요"}
                        </p>
                    )}
                </div>

                <div className="login__wrapper">
                    <label className="login__label" htmlFor="password">
                        비밀번호
                    </label>
                    <div
                        className={
                            errors.password
                                ? "login__input__wrapper login__input__wrapper--error"
                                : "login__input__wrapper"
                        }
                    >
                        <FaKey size="1.2em" />
                        <input
                            className="login__input"
                            id="password"
                            {...register("password", { required: true })}
                            type="password"
                            placeholder="비밀번호"
                        />
                    </div>
                    {errors.password && (
                        <p className="login__error-message">
                            비밀번호를 입력해주세요
                        </p>
                    )}
                </div>

                <div className="login__wrapper">
                    <p
                        className={
                            errorFlag
                                ? "login__error-message"
                                : "login__error-message hidden"
                        }
                    >
                        {errorFlag ? errorMessage : null}
                    </p>
                </div>

                <input type="submit" className="login__submit" value="로그인" />
            </form>
            <div className="login__navigate">
                <button
                    onClick={() => navigate("/agree")}
                    className="login__navigate__btn"
                >
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
