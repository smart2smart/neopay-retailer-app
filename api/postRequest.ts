import {checkTokenValidity} from "./checkToken";
import store from "../store/store";
import PersistenceStore from "../utils/PersistenceStore";

let state = store.getState();

const dictToParams = (dict: any) => {
    let params = '';
    Object.keys(dict).map((key, index) => {
        params += key + '=' + dict[key] + '&'
    });
    return params;
}

export const PostRequest = async (payload: any) => {
    let data
    try {
        let response = await fetch(payload.url, {
            method: payload.method,
            headers: new Headers(payload.header),
            body: dictToParams(payload.data),
            credentials: 'include',
        })
        await response.json().then(json => {
            if (response.status == 401 || response.status == 403) {
                reset();
                return;
            }
            data = {status: response.status, data: json};
        });
    } catch (error) {
        data = error;
    }
    return data;
}

export const UploadFile = async (payload: any) => {
    let data
    try {
        let response = await fetch(payload.url, {
            method: payload.method,
            headers: new Headers(payload.header),
            body: payload.data,
            credentials: 'include',
        })
        await response.json().then(json => {
            data = {status: response.status, data: json};
        });
    } catch (error) {
        data = error;
    }
    return data;
}


const reset = () => {
    store.dispatch({type: 'IS_LOGGED_IN', payload: false});
    PersistenceStore.removeAccessToken();
    PersistenceStore.removeRefreshToken();
    PersistenceStore.removeTimeStamp();
}

