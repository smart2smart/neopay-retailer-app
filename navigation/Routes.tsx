import React, {useState, useEffect, useCallback} from "react";
import useColorScheme from "../hooks/useColorScheme";
import {checkTokenFromStorage} from "../api/checkToken";
import Navigation from "./index";
import AuthStack, {VersionStack} from "./AuthStack";
import mapStateToProps from "../store/mapStateToProps";
import {setIsLoggedIn, setLandingScreen, setTokens} from "../actions/actions";
import {connect, useSelector} from 'react-redux';
import {SafeAreaView, Alert} from "react-native";
import PersistenceStore from "../utils/PersistenceStore";
import * as Updates from 'expo-updates';
import * as SplashScreen from 'expo-splash-screen';

function Routes(props: any) {

    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const [appIsReady, setAppIsReady] = useState(false);
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

            }
        } catch (e) {

        }
    }

    const getStack = () => {
        if (isLoggedIn) {
            if (forceUpdateFromPlayStore) {
                return <VersionStack colorScheme={colorScheme}/>;
            } else {
                return <Navigation colorScheme={colorScheme}/>
            }
        } else {
            return <AuthStack colorScheme={colorScheme}/>
        }
    }


    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Pre-load fonts, make any API calls you need to do here
                await getUserDetails();
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }
    return (
        <SafeAreaView style={{flex: 1}}>
            {getStack()}
        </SafeAreaView>
    );
}

export default connect(mapStateToProps, {setIsLoggedIn, setTokens, setLandingScreen})(Routes);