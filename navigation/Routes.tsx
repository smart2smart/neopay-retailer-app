import React, {useState} from "react";
import useColorScheme from "../hooks/useColorScheme";
import {checkTokenFromStorage} from "../api/checkToken";
import AppLoading from "expo-app-loading";
import Navigation from "./index";
import AuthStack from "./AuthStack";
import mapStateToProps from "../store/mapStateToProps";
import {setIsLoggedIn, setTokens} from "../actions/actions";
import {connect, useSelector} from 'react-redux';
import {SafeAreaView, View} from "react-native";

function Routes(props: any) {

    const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();

    const getUserDetails = async () => {
        let tokens = await checkTokenFromStorage();
        if (tokens) {
            props.setIsLoggedIn(true);
        }
        setLoading(false);
    }

    if (loading) {
        return <AppLoading
            startAsync={() => getUserDetails()}
            onFinish={() => {
            }}
            onError={console.warn}
        />;
    } else {
        return (
            <SafeAreaView style={{flex: 1}}>
                    {isLoggedIn ? <Navigation colorScheme={colorScheme}/> : <AuthStack colorScheme={colorScheme}/>}
            </SafeAreaView>
        );
    }
}
export default connect(mapStateToProps, {setIsLoggedIn, setTokens})(Routes);