import React, {useState} from "react";
import useColorScheme from "../hooks/useColorScheme";
import {checkTokenFromStorage} from "../api/checkToken";
import AppLoading from "expo-app-loading";
import Navigation from "./index";
import AuthStack, {VersionStack} from "./AuthStack";
import mapStateToProps from "../store/mapStateToProps";
import {setIsLoggedIn, setLandingScreen, setTokens} from "../actions/actions";
import {connect, useSelector} from 'react-redux';
import {SafeAreaView, Alert} from "react-native";
import PersistenceStore from "../utils/PersistenceStore";
import * as Updates from 'expo-updates';
import VersionCheck from 'react-native-version-check-expo';
import Constants from "expo-constants";

function Routes(props: any) {

    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const [forceUpdateFromPlayStore, setForceUpdateFromPlayStore] = useState(false);

    const getUserDetails = async () => {
        let tokens = await checkTokenFromStorage();
        if (tokens) {
            let initialScreen = await PersistenceStore.getLandingScreen();
            props.setIsLoggedIn(true);
            props.setLandingScreen(initialScreen);
            props.setLandingScreen(initialScreen);
        }
        checkForUpdates();
        setLoading(false);
    }

    const checkForUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();
                Alert.alert(
                    "App Updated",
                    "App has been updated. Will restart now.",
                    [
                        {text: "OK", onPress: () => Updates.reloadAsync()}
                    ]
                );
            } else {
                openPlayStoreLink()
            }
        } catch (e) {

        }
    }

    const openPlayStoreLink = () => {
        VersionCheck.getLatestVersion().then(version => {
            let playStoreVersion = version.split(".")
            let appVersion = Constants.manifest.version.split(".");
            if (parseInt(playStoreVersion[0]) > parseInt(appVersion[0])) {
                setForceUpdateFromPlayStore(true);
            }
        })
    }


    const getStack = () => {
        if (isLoggedIn) {
            if (forceUpdateFromPlayStore) {
                return <VersionStack colorScheme={colorScheme} />;
            } else {
                return <Navigation colorScheme={colorScheme}/>
            }
        } else {
            return <AuthStack colorScheme={colorScheme}/>
        }
    }

    if (loading) {
        return <AppLoading
            startAsync={() => getUserDetails()}
            onFinish={() => {
            }}
            onError={() => {
            }}
        />;
    } else {
        return (
            <SafeAreaView style={{flex: 1}}>
                {getStack()}
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, {setIsLoggedIn, setTokens, setLandingScreen})(Routes);