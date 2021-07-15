import {IS_LOGGED_IN } from "../actions/actionTypes";


const loginReducer = (state = false, action:any) => {
    switch (action.type) {
        case IS_LOGGED_IN: {
            return action.payload;
        }
        default:
            return state
    }
}
export default loginReducer;