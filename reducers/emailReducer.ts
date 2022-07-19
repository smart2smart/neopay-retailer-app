import { IS_LOGGED_IN } from "../actions/actionTypes";

const emailReducer = (state = "", action: any) => {
  switch (action.type) {
    case "USER_EMAIL": {
      console.log(action);
      return action.payload;
    }
    default:
      return state;
  }
};
export default emailReducer;
