import {
    IS_LOGGED_IN,
    TOKENS,
    RETAILER_DETAILS,
    SCREEN,
    ADD_TO_CART,
    UPDATE_CART_ADD,
    UPDATE_CART_SUBTRACT, CART_CHANGE_QUANTITY
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

export const addToCart = (value:any)=>{
    return({
        type:ADD_TO_CART,
        payload:value
    })
}

export const updateCartAdd = (value:any)=>{
    return({
        type:UPDATE_CART_ADD,
        payload:value
    })
}

export const cartChangeQuantity = (value:any)=>{
    return({
        type:CART_CHANGE_QUANTITY,
        payload:value
    })
}

export const updateCartSubtract = (value:any)=>{
    return({
        type:UPDATE_CART_SUBTRACT,
        payload:value
    })
}

export const setLandingScreen = (value:any)=>{
    return({
        type:SCREEN,
        payload:value
    })
}


