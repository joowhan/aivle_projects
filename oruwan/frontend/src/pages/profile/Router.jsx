import React from "react";
import { Route, Routes } from "react-router-dom";
import ProfileMainPage from "./Profile";

const ProfileRouter = () => {
    return (
        <div className="disable-text-selection">
            <Routes>
                <Route path="/*" element={<ProfileMainPage />}></Route>
            </Routes>
        </div>
    );
};

export default ProfileRouter;
