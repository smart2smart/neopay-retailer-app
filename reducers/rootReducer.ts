import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import tokenReducer from "./tokenReducer";

export default combineReducers({
    isLoggedIn : loginReducer,
    tokens:tokenReducer,
})