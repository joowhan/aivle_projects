import React from "react";
import { Route, Routes } from "react-router-dom";
import ChallengeProofPage from "./ChallengeProof";
import ChallengeMainPage from "./ChallengeMain";
import ChallengeProofResultPage from "./ChallengeProof";
import ChallengeDetailPage from "./ChallengeDetail";
import ChallengeProgressPage from "./ChallengeProgress";
import ChallengeResultPage from "./ChallengeResult";
import ChallengeSuccessPage from "./ChallengeSuccess";
import ChallengeFailPage from "./ChallengeFail";
import ChallengeRecommendPage from "./ChallengeRecommend";

const ChallengePage = () => {
    return (
        <div className="disable-text-selection">
            <Routes>
                <Route path="/*" element={<ChallengeMainPage />}></Route>
                <Route path="proof" element={<ChallengeProofPage />}></Route>
                <Route path="detail" element={<ChallengeDetailPage />}></Route>
                <Route
                    path="proof/result"
                    element={<ChallengeProofResultPage />}
                ></Route>
                <Route
                    path="progress"
                    element={<ChallengeProgressPage />}
                ></Route>
                <Route
                    path="result/:id"
                    element={<ChallengeResultPage />}
                ></Route>
                <Route
                    path="success/:id"
                    element={<ChallengeSuccessPage />}
                ></Route>
                <Route path="fail/:id" element={<ChallengeFailPage />}></Route>
                <Route
                    path="recommend/"
                    element={<ChallengeRecommendPage />}
                ></Route>
            </Routes>
        </div>
    );
};

export default ChallengePage;
