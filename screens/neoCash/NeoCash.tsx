import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    FlatList
} from 'react-native';
// @ts-ignore
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import commonStyles from "../../styles/commonStyles";
import texts from "../../styles/texts";
import {useNavigation} from "@react-navigation/native";
import {useRoute} from '@react-navigation/native';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import {BlueButtonSmall, BorderButtonSmallRed} from "../../buttons/Buttons";
import OrdersCard from "../../commons/OrdersCard";
import RetailerDetails from '../details/RetailerDetails';
import * as Linking from "expo-linking";

export default function NeoCash(props) {

    const [neoCash, setNeoCash] = useState(props.route.params.data);
    // console.log('DATA', neoCash);

    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <SecondaryHeader title={"NeoCash"}/>
            <View style={{backgroundColor:colors.lightGrey, padding:30, marginTop:20, borderRadius:5}}>
                <View style={{alignSelf:'center'}}>
                    <Text style={texts.lightRedBold37}>{'₹'}{neoCash}</Text>
                </View>
                <View style={{alignSelf:'center'}}>
                    <Text style={texts.blackTextBold14}>NeoCash Balance</Text>
                </View>
            </View>
            <View style={{marginTop:20}}>
                <Text style={texts.blackTextBold16}>Expiring Soon</Text>
            </View>
        </View>
    )
}