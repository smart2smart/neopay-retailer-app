// import * as React from 'react';
import React, {Component, useEffect, useState} from 'react';
import {View, StyleSheet, Text,FlatList, Image} from "react-native";
import texts from "../styles/texts";
import PrimaryHeader from "../headers/PrimaryHeader";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../styles/commonStyles';
import { BorderButtonBigRed } from '../buttons/Buttons';
import colors from "../assets/colors/colors";

export default function VerificationPending(props:any) {

    const navigation = useNavigation();

    return(
        <View style={{flex: 1}}>
            <PrimaryHeader navigation={props.navigation}/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={texts.blackTextBold18}>
                    Verification Pending
                </Text>
                <Text style={texts.greyTextBold14}>
                    Please wait for profile verification to use the app.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardImage: {
        height: 40,
        width: 80,
        backgroundColor: colors.light_grey
    },
})
