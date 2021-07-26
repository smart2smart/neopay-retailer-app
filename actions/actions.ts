import { IS_LOGGED_IN, TOKENS, RETAILER_DETAILS} from "./actionTypes";

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


