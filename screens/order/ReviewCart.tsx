import React, { Component, useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import mapStateToProps from "../../store/mapStateToProps";
import { setIsLoggedIn } from "../../actions/actions";
// @ts-ignore
import { connect, useSelector } from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import texts from '../../styles/texts';
import commonStyles from '../../styles/commonStyles';
import { BorderButtonSmallBlue, SolidButtonBlue } from '../../buttons/Buttons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/AntDesign';
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";

export default function ReviewCart() { 
    return (
        <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: colors.white }}>
            <SecondaryHeader title={"Cart"} />
            <View style={{marginVertical:20}}>
                <Text style={texts.blackTextBold14}>
                    SKUs in cart
                </Text>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Text>ABC</Text>
            </ScrollView>
            <View style={[commonStyles.rowFlexEnd, {borderTopColor:colors.light_grey, borderTopWidth:1, paddingTop:20}]}>
                <View>
                    <BorderButtonSmallBlue text={'Discard'}/>
                </View>
                <View style={{marginLeft:10}}>
                    <SolidButtonBlue text={' Confirm Order '}/>
                </View>
            </View>
        </View>
    )
}