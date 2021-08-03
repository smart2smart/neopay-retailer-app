import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
} from 'react-native';
// @ts-ignore
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";

export default function NeoCash(props) {

    const [neoCash, setNeoCash] = useState(props.route.params.data);

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