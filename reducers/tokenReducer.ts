import {TOKENS } from "../actions/actionTypes";


const tokenReducer = (state = false, action:any) => {
    switch (action.type) {
        case TOKENS: {
            return action.payload;
        }
        default:
            return state
    }
}
export default tokenReducer;