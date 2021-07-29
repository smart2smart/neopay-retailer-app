import {AsyncStorage} from "react-native";

class PersistenceStore {
    static async getAccessToken() {
        return await AsyncStorage.getItem('@accessToken');
    }

    static async setAccessToken(token: string) {
        await AsyncStorage.setItem('@accessToken', token)
    }

    static removeAccessToken() {
        AsyncStorage.removeItem('@accessToken');
    }

    static async getRefreshToken() {
        return await AsyncStorage.getItem('@refreshToken');
    }

    static async setRefreshToken(token: string) {
        await AsyncStorage.setItem('@refreshToken', token)
    }

    static async getLandingScreen() {
        return await AsyncStorage.getItem('@landingScreen');
    }

    static async setLandingScreen(token: string) {
        await AsyncStorage.setItem('@landingScreen', token)
    }

    static async removeRefreshToken() {
        await AsyncStorage.removeItem('@refreshToken');
    }

    static async getTimeStamp() {
        return await AsyncStorage.getItem('@timeStamp');
    }

    static async setTimeStamp(timeStamp: string) {
        await AsyncStorage.setItem('@timeStamp', timeStamp)
    }

    static async removeTimeStamp() {
        await AsyncStorage.removeItem('@timeStamp');
    }
}

export default PersistenceStore