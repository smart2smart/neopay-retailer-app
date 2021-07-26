import {RETAILER_DETAILS } from "../actions/actionTypes";


const retailerDetailsReducer = (state = {}, action:any) => {
    switch (action.type) {
        case RETAILER_DETAILS: {
            return action.payload;
        }
        default:
            return state
    }
}
export default retailerDetailsReducer;