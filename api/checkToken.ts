import Moment from 'moment';
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
                    let timestamp = await (new Date("2021-06-27")).toString();
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

export const checkTokenValidity = (access: string, refresh: string, timestamp: string) => {
    let now = Moment();
    let minDiff = now.diff(new Date(timestamp), 'minutes');
    if (minDiff < 29) {
        store.dispatch({
            type: 'TOKENS',
            payload: {access: access, refresh: refresh, timestamp: (new Date()).toString()}
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
                setData(res)
                return true;
            }
        })
}

const setData = (res)=>{
    store.dispatch({
        type: 'TOKENS',
        payload: {access: res.data.access, refresh: res.data.refresh, timestamp: (new Date()).toString()}
    });
    PersistenceStore.setAccessToken(res && res.data.access);
    PersistenceStore.setRefreshToken(res && res.data.refresh);
    PersistenceStore.setTimeStamp((new Date()).toString());
}