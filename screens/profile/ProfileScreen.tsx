import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import mapStateToProps from "../../store/mapStateToProps";
import {setIsLoggedIn} from "../../actions/actions";
// @ts-ignore
import {connect, useSelector} from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import texts from '../../styles/texts';
import commonStyles from '../../styles/commonStyles';
import { BorderButtonSmallBlue, SolidButtonBlue } from '../../buttons/Buttons';
import Icon from 'react-native-vector-icons/Feather';

export function ProfileScreen(props: any) {

    return (
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <View>
                <SecondaryHeader title={"Retailer Profile"}/>
                <Image style={{height:300, width:'100%'}} source={require("../../assets/images/adaptive-icon.png")}/>
            </View>
                <View style={{borderRadius:10, borderColor:colors.light_grey, borderWidth:1, padding:20,}}>
                    <View style={{paddingBottom:20}}>
                        <Text style={texts.blackTextBold16}>New general store</Text>
                    </View>
                    <View style={{paddingBottom:8}}>
                        <Text style={texts.greyNormal14}>Contact Person : Anup Kumar</Text>
                    </View>
                    <View style={[commonStyles.rowSpaceBetween, {paddingBottom:8}]}>
                        <Text style={texts.greyNormal14}>Phone No. : +91 78541265</Text>
                        <Image style={{height:24, width:24}} source={require("../../assets/images/call-icon.png")}/>
                    </View>
                    <View style={[commonStyles.rowSpaceBetween, {borderBottomColor:colors.light_grey, borderBottomWidth:1, paddingBottom:20}]}>
                        <Text style={texts.greyNormal14}>Address : F215 Himmat Marg, Saket</Text>
                        <Icon name={"map-pin"} size={20} style={{color: colors.orange}}/>
                    </View>
                    <View style={[commonStyles.rowFlexEnd, {paddingTop:15}]}>
                        <BorderButtonSmallBlue text={'Edit Profile'}/>
                        <View style={{marginLeft:10}}>
                            <SolidButtonBlue text={' Build Order '}/>
                        </View>
                    </View>
                </View>
                <View style={{borderRadius:10, borderColor:colors.light_grey, borderWidth:1, padding:10, marginVertical:20}}>
                    <View style={commonStyles.rowSpaceBetween}>
                        <Text style={texts.blackTextBold14}>NeoCash Balance</Text>
                        <Text style={texts.redTextBold15}>₹ 1500</Text>
                    </View>
                </View>
                <View style={{borderRadius:10, borderColor:colors.light_grey, borderWidth:1, padding:10, marginBottom:20}}>
                    <View style={commonStyles.rowSpaceBetween}>
                        <Text style={texts.blackTextBold14}>Loyality Points</Text>
                        <Text style={texts.redTextBold15}>500</Text>
                    </View>
                </View>
                <View style={{borderRadius:10, borderColor:colors.light_grey, borderWidth:1, padding:10, marginBottom:20}}>
                    <View style={commonStyles.rowSpaceBetween}>
                        <Text style={texts.blackTextBold14}>My Orders</Text>
                        <Icon name={"chevron-right"} size={20} style={{color: colors.orange}}/>
                    </View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 200,
        backgroundColor: colors.primary_color
    },
    statsCard: {
        backgroundColor: colors.white,
        height: 170,
        elevation: 5,
        borderRadius: 5,
        width: Dimensions.get("window").width - 48,
        position: "absolute",
        top: 124,
        left: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "space-between"
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey,
        paddingBottom: 16
    }
});

export default connect(mapStateToProps, {setIsLoggedIn})(ProfileScreen);
