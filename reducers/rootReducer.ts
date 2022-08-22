import { combineReducers } from "redux";
import tokenReducer from "./tokenReducer";
import retailerDetailsReducer from "./retailerDetailsReducer";
import landingScreenReducer from "./landingScreen";
import verificationStatusReducer from "./verificationStatusReducer";
import filterReducer from "./filterReducer";
import emailReducer from "./emailReducer";
import expoTokenReducer from "./expoTokenReducer";
import productReducer from "./productReducer";
import cartInDraftReducer from "./cartReducer";

export default combineReducers({
  userType: emailReducer,
  tokens: tokenReducer,
  retailerDetails: retailerDetailsReducer,
  landingScreen: landingScreenReducer,
  verificationStatus: verificationStatusReducer,
  filters: filterReducer,
  expoToken: expoTokenReducer,
  cartDraft: cartInDraftReducer,
  product: productReducer,
});
