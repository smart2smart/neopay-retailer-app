import {VERIFICATION_STATUS} from "../actions/actionTypes";


const verificationStatusReducer = (state = '', action:any) => {
    switch (action.type) {
        case VERIFICATION_STATUS: {
            return action.payload;
        }
        default:
            return state
    }
}
export default verificationStatusReducer;