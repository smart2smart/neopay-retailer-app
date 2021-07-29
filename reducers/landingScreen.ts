import {SCREEN} from "../actions/actionTypes";


const landingScreenReducer = (state = '', action:any) => {
    switch (action.type) {
        case SCREEN: {
            return action.payload;
        }
        default:
            return state
    }
}
export default landingScreenReducer;