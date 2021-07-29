import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import tokenReducer from "./tokenReducer";
import retailerDetailsReducer from "./retailerDetailsReducer";
import cartReducer from "./cartReducer";
import landingScreenReducer from "./landingScreen";

export default combineReducers({
    isLoggedIn : loginReducer,
    tokens:tokenReducer,
    retailerDetails:retailerDetailsReducer,
    cart:cartReducer,
    landingScreen:landingScreenReducer
})