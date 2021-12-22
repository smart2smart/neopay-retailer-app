// import * as React from 'react';
import React, {Component, useEffect, useState} from 'react';
import {View, StyleSheet, Text, FlatList, Image, Alert, ScrollView, RefreshControl} from "react-native";
import texts from "../styles/texts";
import PrimaryHeader from "../headers/PrimaryHeader";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../styles/commonStyles';
import { BorderButtonBigRed } from '../buttons/Buttons';
import colors from "../assets/colors/colors";
import store from "../store/store";
import PersistenceStore from "../utils/PersistenceStore";

export default function VerificationPending(props:any) {

    const navigation = useNavigation();
    const route = useRoute();

    const [refreshing, setRefreshing] = useState(false);

    const LogOut = () => {
        Alert.alert(
            'LogOut',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        store.dispatch({type: 'IS_LOGGED_IN', payload: false});
                        PersistenceStore.removeTimeStamp();
                        PersistenceStore.removeAccessToken();
                        PersistenceStore.removeRefreshToken();
                    },
                },
                {text: 'No', onPress: () => {}},
            ],
            {cancelable: false},
        );
    };

    return(
        <ScrollView refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={()=>{route.params.retailerDetails()}}
            />
        } contentContainerStyle={{flex: 1}}>
            <PrimaryHeader logout={LogOut} type={"verification"} navigation={props.navigation}/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal:24}}>
                <Text style={texts.blackTextBold18}>
                    Verification Pending
                </Text>
                <Text style={[texts.greyTextBold14, {textAlign:"center"}]}>
                    Please wait for profile verification to use the app.
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    cardImage: {
        height: 40,
        width: 80,
        backgroundColor: colors.light_grey
    },
})
