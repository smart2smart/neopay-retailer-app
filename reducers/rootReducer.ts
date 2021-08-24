import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import tokenReducer from "./tokenReducer";
import retailerDetailsReducer from "./retailerDetailsReducer";
import cartReducer from "./cartReducer";
import landingScreenReducer from "./landingScreen";
import verificationStatusReducer from "./verificationStatusReducer";
import filterReducer from "./filterReducer";

export default combineReducers({
    isLoggedIn : loginReducer,
    tokens:tokenReducer,
    retailerDetails:retailerDetailsReducer,
    cart:cartReducer,
    landingScreen:landingScreenReducer,
    verificationStatus:verificationStatusReducer,
    filters:filterReducer,
})