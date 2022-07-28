import { combineReducers } from "redux";
import tokenReducer from "./tokenReducer";
import retailerDetailsReducer from "./retailerDetailsReducer";
import cartReducer from "./cartReducer";
import landingScreenReducer from "./landingScreen";
import verificationStatusReducer from "./verificationStatusReducer";
import filterReducer from "./filterReducer";
import emailReducer from "./emailReducer";
import expoTokenReducer from "./expoTokenReducer";

export default combineReducers({
  userType: emailReducer,
  tokens: tokenReducer,
  retailerDetails: retailerDetailsReducer,
  cart: cartReducer,
  landingScreen: landingScreenReducer,
  verificationStatus: verificationStatusReducer,
  filters: filterReducer,
  expoToken: expoTokenReducer,
});
