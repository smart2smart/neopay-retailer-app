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

function Routes(props: any) {

    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();

    const getUserDetails = async () => {
        let tokens = await checkTokenFromStorage();
        if (tokens) {
            let initialScreen = await PersistenceStore.getLandingScreen();
            props.setIsLoggedIn(true);
            props.setLandingScreen(initialScreen);
            props.setLandingScreen(initialScreen);
        }
        setLoading(false);
    }

    const getStack = () => {
        if (isLoggedIn) {
            return <Navigation colorScheme={colorScheme}/>
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