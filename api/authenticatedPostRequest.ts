import store from "../store/store";
import {checkTokenValidity} from "./checkToken";
import PersistenceStore from "../utils/PersistenceStore";
import {PostRequest, UploadFile} from "./postRequest";


export const AuthenticatedPostRequest = (payload: any) => {
    let state = store.getState();
    if (checkTokenValidity(state.tokens["access"], state.tokens["refresh"], state.tokens["timestamp"])) {
        payload.header["Authorization"] = `Bearer ${state.tokens["access"]}`
        return PostRequest(payload).then((res) => {
            return res;
        })
    }
}

export const UploadFileRequest = (payload: any) => {
    let state = store.getState();
    if (checkTokenValidity(state.tokens["access"], state.tokens["refresh"], state.tokens["timestamp"])) {
        payload.header["Authorization"] = `Bearer ${state.tokens["access"]}`
        return UploadFile(payload).then((res) => {
            return res;
        })
    }
}