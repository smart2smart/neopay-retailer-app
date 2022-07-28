import { RETAILER_DETAILS } from "../actions/actionTypes";

const retailerDetailsReducer = (state = null, action: any) => {
  switch (action.type) {
    case RETAILER_DETAILS: {
      return action.payload;
    }
    case "RESET_RETAILER": {
      return null;
    }
    default:
      return state;
  }
};
export default retailerDetailsReducer;
