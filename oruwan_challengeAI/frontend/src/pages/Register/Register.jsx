import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// css 적용 import
import "../../styles/reset.css";
import "./Register.css";

// 컴포넌트
import Header from "../../components/layouts/Header.jsx";

// 아이콘
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";

const LoginPage = () => {
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        watch,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async data => {
        const response = await axios.post(
            "http://127.0.0.1:8000/api/register/",
            {
                email: data.email,
                password: data.password,
                username: data.username,
            },
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }
        );
        if (response.data.is_created == "1") {
            alert("회원가입이 완료되었습니다.");
            navigate("/login");
        } else {
            setErrorFlag(true);
            setErrorMessage(response.data.message);
        }
    };

    return (
        <div id="registerContainer">
            <Header title="회원가입" />
            <form
                className="register_form"
                onSubmit={handleSubmit(data => onSubmit(data))}
            >
                <div className="register__wrapper">
                    <label htmlFor="email" className="register__label">
                        이메일
                    </label>
                    <div
                        className={
                            errors.email
                                ? "register__input__wrapper register__input__wrapper--error"
                                : "register__input__wrapper"
                        }
                    >
                        <FaEnvelope size="1.2em" />
                        <input
                            className="register__input"
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
                        <p className="register__error-message">
                            {errors.email.message
                                ? errors.email.message
                                : "이메일을 입력해주세요"}
                        </p>
                    )}
                </div>
                <div className="register__wrapper">
                    <label className="register__label" htmlFor="password">
                        비밀번호
                    </label>
                    <div
                        className={
                            errors.password
                                ? "register__input__wrapper register__input__wrapper--error"
                                : "register__input__wrapper"
                        }
                    >
                        <FaKey size="1.2em" />
                        <input
                            className="register__input"
                            id="password"
                            {...register("password", {
                                required: true,
                                pattern: {
                                    value: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,16}$/,
                                    message:
                                        "비밀번호는 8~16자의 영문 대 소문자, 숫자, 특수문자의 조합이어야 합니다.",
                                },
                            })}
                            type="password"
                            placeholder="비밀번호"
                        />
                    </div>
                    {errors.password && (
                        <p className="register__error-message">
                            {errors.password.message
                                ? errors.password.message
                                : "비밀번호를 입력해주세요"}
                        </p>
                    )}
                </div>
                <div className="register__wrapper">
                    <label
                        className="register__label"
                        htmlFor="confirm_password"
                    >
                        비밀번호 확인
                    </label>
                    <div
                        className={
                            watch("password") !== watch("confirm_password")
                                ? "register__input__wrapper register__input__wrapper--error"
                                : "register__input__wrapper"
                        }
                    >
                        <FaKey size="1.2em" />
                        <input
                            className="register__input"
                            id="confirm_password"
                            {...register("confirm_password", {
                                required: true,
                            })}
                            type="password"
                            placeholder="비밀번호 확인"
                        />
                    </div>
                    {watch("password") !== watch("confirm_password") &&
                    getValues("confirm_password") ? (
                        <p className="register__error-message">
                            비밀번호가 일치하지 않습니다.
                        </p>
                    ) : null}
                </div>

                <div className="register__wrapper">
                    <label className="register__label" htmlFor="username">
                        닉네임
                    </label>
                    <div
                        className={
                            errors.password
                                ? "register__input__wrapper register__input__wrapper--error"
                                : "register__input__wrapper"
                        }
                    >
                        <FaUser size="1.2em" />
                        <input
                            className="register__input"
                            id="username"
                            {...register("username", { required: true })}
                            placeholder="닉네임"
                        />
                    </div>
                    {errors.username && (
                        <p className="register__error-message">
                            닉네임을 입력해주세요
                        </p>
                    )}
                </div>
                <div className="register__wrapper">
                    <p
                        className={
                            errorFlag
                                ? "register__error-message"
                                : "register__error-message hidden"
                        }
                    >
                        {errorFlag ? errorMessage : null}
                    </p>
                </div>

                <input
                    type="submit"
                    className="register__submit"
                    value="회원가입"
                />
            </form>
        </div>
    );
};

export default LoginPage;
