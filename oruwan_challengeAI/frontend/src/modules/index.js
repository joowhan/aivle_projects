import { combineReducers } from "redux";
import baseUrl from "./baseUrl";
import myChallengeList from "./myChallengeList";

const rootReducer = combineReducers({
    baseUrl,
    myChallengeList,
});

export default rootReducer;
