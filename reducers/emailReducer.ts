import { IS_LOGGED_IN } from "../actions/actionTypes";

const userTypeReducer = (state = "", action: any) => {
  switch (action.type) {
    case "USER_TYPE": {
      console.log(action);
      return action.payload;
    }
    default:
      return state;
  }
};
export default userTypeReducer;
