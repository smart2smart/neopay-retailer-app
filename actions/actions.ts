import {
    IS_LOGGED_IN,
    TOKENS,
    RETAILER_DETAILS,
    SCREEN,
    ADD_TO_CART,
    UPDATE_CART_ADD,
    UPDATE_CART_SUBTRACT,
    CART_CHANGE_QUANTITY,
    NEW_CART,
    CLEAR_CART,
    VERIFICATION_STATUS, REMOVE_FROM_CART
} from "./actionTypes";

export const setIsLoggedIn = (value: any) => {
    return ({
        type: IS_LOGGED_IN,
        payload: value
    });
}


export const setTokens = (value: any) => {
    return ({
        type: TOKENS,
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


