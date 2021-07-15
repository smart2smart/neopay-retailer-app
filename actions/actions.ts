import { IS_LOGGED_IN, TOKENS} from "./actionTypes";

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