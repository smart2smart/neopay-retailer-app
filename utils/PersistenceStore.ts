import AsyncStorage from "@react-native-async-storage/async-storage";

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

    static async getUserEmail() {
        return await AsyncStorage.getItem('@userEmail');
    }

    static async setUserEmail(userEmail: string) {
        await AsyncStorage.setItem('@userEmail', userEmail)
    }

    static async removeUserEmail() {
        await AsyncStorage.removeItem('@userEmail');
    }

    static async setCart(cart: string) {
        await AsyncStorage.setItem('@cart', cart);
    }

    static async getCart() {
        return await AsyncStorage.getItem('@cart');
    }

    static async removeCart() {
        await AsyncStorage.removeItem('@cart');
    }

    static async getVerificationStatus() {
        return await AsyncStorage.getItem('@verificationStatus');
    }

    static async setVerificationStatus(token: string) {
        await AsyncStorage.setItem('@verificationStatus', token)
    }

    static async setDistributor(distributor: string) {
        await AsyncStorage.setItem('distributor', distributor)
    }

    static async getDistributor() {
        return await AsyncStorage.getItem('distributor')
    }

    static async removeDistributor() {
        await AsyncStorage.removeItem('distributor')
    }
}

export default PersistenceStore