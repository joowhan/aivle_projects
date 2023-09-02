import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

const LogoutPage = () => {
    const token = sessionStorage.getItem("token");
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);

    // 로그아웃 요청, 백엔드 에러가 발생해도 일단 세션 삭제하여 로그아웃 처리
    const logout = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/logout`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };

    const navigate = useNavigate();
    useEffect(() => {
        logout();

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("username");
        alert("로그아웃 되었습니다.");
        navigate("/login");
    });
};

export default LogoutPage;
