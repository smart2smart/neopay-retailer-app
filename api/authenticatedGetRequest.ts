import store from "../store/store";
import {checkTokenValidity} from "./checkToken";
import PersistenceStore from "../utils/PersistenceStore";
import {GetRequest} from "./getRequest";

export const AuthenticatedGetRequest = async (payload: any) => {
    let state = store.getState();
    let token = await checkTokenValidity(state.tokens["access"], state.tokens["refresh"], state.tokens["timestamp"])
    if (token) {
        payload.header["Authorization"] = `Bearer ${state.tokens["access"]}`
        return GetRequest(payload).then((res) => {
            if (res.status == 401 || res.status == 403) {
                store.dispatch({type: 'IS_LOGGED_IN', payload: false});
                PersistenceStore.removeAccessToken();
                PersistenceStore.removeRefreshToken();
                PersistenceStore.removeUserType();
                PersistenceStore.removeTimeStamp();
            } else {
                return res;
            }
        })
    }
}