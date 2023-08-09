import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

// css 적용 import
import "../../styles/reset.css";
import "./Auth.css";

// 컴포넌트
import Header from "../../components/layouts/Header.jsx";

const AuthPage = () => {
    const navigate = useNavigate();
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);

    const {
        register,
        handleSubmit,
        formState: { isDirty, isValid },
    } = useForm({ mode: "onChange" });

    const onSubmit = async data => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/smssend/`,
                {
                    phone_number: data.phoneNumber,
                },
                {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            alert("인증번호가 발송되었습니다.");
            navigate("/verify", { state: { phoneNumber: data.phoneNumber } });
        } catch (error) {
            console.log(error);
            alert("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div id="authContainer">
            <Header title="회원가입" />
            <div className="auth__wrapper">
                <div className="auth__text--main">
                    휴대폰 번호를 입력해주세요.
                </div>
                <div className="auth__text--sub">
                    본인 인증을 위해 필요합니다.
                </div>
                <form
                    onSubmit={handleSubmit(data => onSubmit(data))}
                    className="auth__form"
                >
                    <div className="auth-input__wrapper">
                        <input
                            className="auth-input"
                            id="phoneNumber"
                            type="number"
                            {...register("phoneNumber", {
                                required: true,
                                pattern: {
                                    value: /^(01[016789]\d{7,8})$/,
                                },
                            })}
                        />
                    </div>
                    <button
                        className="auth-btn"
                        disabled={!isDirty || !isValid}
                    >
                        확 인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
