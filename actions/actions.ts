import {
    TOKENS,
    RETAILER_DETAILS,
    SCREEN,
    UPDATE_CART_ADD,
    UPDATE_CART_SUBTRACT,
    CART_CHANGE_QUANTITY,
    NEW_CART,
    CLEAR_CART,
    VERIFICATION_STATUS, REMOVE_FROM_CART,
    COMPANY_FILTER_ADD,
    COMPANY_FILTER_REMOVE,
    BRAND_FILTER_ADD,
    BRAND_FILTER_REMOVE,
    PRODUCT_GROUP_FILTER_ADD,
    PRODUCT_GROUP_FILTER_REMOVE,
    RESET_FILTERS,
    SELECT_FILTER_TYPE, MARGIN_FILTERS, CHANGE_LOT_SIZE
} from "./actionTypes";

  

export const setTokens = (value: any) => {
    return ({
        type: TOKENS,
        payload: value
    });
}

export const resetSalesman = () => {
    return {
      type: "RESET_RETAILER",
  };
};

export const setExpoTokens = (value: any) => {
  return {
    type: "EXPO_TOKENS",
    payload: value,
  };
};

export const setUserType = (value: any) => {
    return ({
        type: "USER_TYPE",
        payload: value
    });
}

export const setRetailerDetails = (value: any) => {
    return ({
        type: RETAILER_DETAILS,
        payload: value
    });
}

export const newCart = (value: any) => {
    return ({
        type: NEW_CART,
        payload: value
    });
}

export const clearCart = (value: any) => {
    return ({
        type: CLEAR_CART,
        payload: value
    });
}


export const updateCartAdd = (value: any) => {
    return ({
        type: UPDATE_CART_ADD,
        payload: value
    })
}

export const updateCartSubtract = (value: any) => {
    return ({
        type: UPDATE_CART_SUBTRACT,
        payload: value
    })
}

export const removeFromCart = (value: any) => {
    return ({
        type: REMOVE_FROM_CART,
        payload: value
    })
}

export const cartChangeQuantity = (value: any) => {
    return ({
        type: CART_CHANGE_QUANTITY,
        payload: value
    })
}

export const setLandingScreen = (value: any) => {
    return ({
        type: SCREEN,
        payload: value
    })
}

export const setVerificationStatus = (value: any) => {
    return ({
        type: VERIFICATION_STATUS,
        payload: value
    })
}

export const companyFilterAdd = (value: any) => {
    return ({
        type: COMPANY_FILTER_ADD,
        payload: value
    })
}

export const companyFilterRemove = (value: any) => {
    return ({
        type: COMPANY_FILTER_REMOVE,
        payload: value
    })
}

export const brandFilterAdd = (value: any) => {
    return ({
        type: BRAND_FILTER_ADD,
        payload: value
    })
}

export const brandFilterRemove = (value: any) => {
    return ({
        type: BRAND_FILTER_REMOVE,
        payload: value
    })
}


export const productGroupFilterAdd = (value: any) => {
    return ({
        type: PRODUCT_GROUP_FILTER_ADD,
        payload: value
    })
}

export const productGroupFilterRemove = (value: any) => {
    return ({
        type: PRODUCT_GROUP_FILTER_REMOVE,
        payload: value
    })
}

export const resetFilters = (value: any) => {
    return ({
        type: RESET_FILTERS,
        payload: value
    })
}

export const selectFilterType = (value: any) => {
    return ({
        type: SELECT_FILTER_TYPE,
        payload: value
    })
}

export const marginFiltersAdd = (value:any) =>{
    return ({
        type: MARGIN_FILTERS,
        payload: value
    })
}

export const changeLotSize = (value: any) => {
    return ({
        type: CHANGE_LOT_SIZE,
        payload: value
    })
}
