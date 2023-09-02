import React from "react";
import "./styles/reset.css";
import "./styles/common.css";
import "./App.css";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/Login";
import LogoutPage from "./pages/auth/Logout";
import MainPage from "./pages/main/Main";
import ChallengePage from "./pages/challenge/Challenge";
import RoutinePage from "./pages/routine/Routine";
import ProfilePage from "./pages/profile/Profile";
import RegisterPage from "./pages/register/Register";
import AuthPage from "./pages/auth/Auth";
import VerifyPage from "./pages/auth/Verify";
import Onboarding from "./pages/onboarding/Onboarding";
import Blog from "./pages/blog/Blog";
import AgreePage from "./pages/auth/Agree";
import ProfileRouter from "./pages/profile/Router";

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Routes>
                    <Route path="/onboard" Component={Onboarding}></Route>
                    <Route path="/" Component={MainPage}></Route>
                    <Route path="/routine" Component={RoutinePage}></Route>
                    <Route path="/login" Component={LoginPage}></Route>
                    <Route path="/logout" Component={LogoutPage}></Route>
                    <Route path="/register" Component={RegisterPage}></Route>
                    <Route path="/auth" Component={AuthPage}></Route>
                    <Route path="/verify" Component={VerifyPage}></Route>
                    <Route path="/agree" Component={AgreePage}></Route>
                    <Route
                        path="/challenge/*"
                        Component={ChallengePage}
                    ></Route>
                    <Route path="/blog/*" Component={Blog}></Route>
                    <Route path="/profile/*" Component={ProfileRouter}></Route>
                </Routes>
            </div>
        );
    }
}

export default App;
