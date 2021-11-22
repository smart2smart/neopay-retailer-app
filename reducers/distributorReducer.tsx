import {SELECT_DISTRIBUTOR } from "../actions/actionTypes";


const distributorReducer = (state = null, action:any) => {
    switch (action.type) {
        case SELECT_DISTRIBUTOR: {
            return action.payload;
        }
        default:
            return state
    }
}
export default distributorReducer;