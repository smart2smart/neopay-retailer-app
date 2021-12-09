import moment from 'moment';
import {authApi} from "./api";
import {PostRequest} from "./postRequest";
import PersistenceStore from "../utils/PersistenceStore";
import store from "../store/store";

//This function is called when the app launches. Since operations from async storage are time taking,
//we will store the values retrieved from storge into redux and use a different function(checkTokenValidity)
// to check the validity of the tokens.
export const checkTokenFromStorage = () => {
    return PersistenceStore.getRefreshToken().then((refresh) => {
        if (refresh) {
            return PersistenceStore.getAccessToken().then(async (access) => {
                if (access) {
                    // @ts-ignore
                    let timestamp = await PersistenceStore.getTimeStamp();
                    return checkTokenValidity(access, refresh, timestamp)
                } else {
                    return false;
                }
            });
        } else {
            return false;
        }
    });
}

export const checkTokenValidity = (access: string, refresh: string, timestamp: any) => {
    let now = moment().valueOf();
    let minDiff = (now - parseInt(timestamp)) / 60000;
    if (minDiff < 29) {
        store.dispatch({
            type: 'TOKENS',
            payload: {access: access, refresh: refresh, timestamp: timestamp}
        });
        return true;
    } else {
        return getNewToken(access, refresh, timestamp);
    }
}

export const getNewToken = (access: string, refresh: string, timestamp: string) => {
    PersistenceStore.removeAccessToken();
    const data = {
        method: authApi.refresh.method,
        url: authApi.refresh.url,
        data: {
            refresh: refresh
        },
        header: authApi.refresh.header
    }
    return PostRequest(data)
        .then((res) => {
            if (res) {
                setData(res, refresh)
                return true;
            } else {
                return false;
            }
        })
}

const setData = (res, refresh) => {
    store.dispatch({
        type: 'TOKENS',
        payload: {access: res.data.access, refresh: refresh, timestamp: moment().valueOf().toString()}
    });
    PersistenceStore.setAccessToken(res && res.data.access);
    PersistenceStore.setTimeStamp(moment().valueOf().toString());
}