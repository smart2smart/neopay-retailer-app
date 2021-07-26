import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import tokenReducer from "./tokenReducer";
import retailerDetailsReducer from "./retailerDetailsReducer";

export default combineReducers({
    isLoggedIn : loginReducer,
    tokens:tokenReducer,
    retailerDetails:retailerDetailsReducer,
})