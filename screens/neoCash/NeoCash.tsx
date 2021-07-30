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

    const mockData = 
    {
        offerDetails: [
            {
                amount_recived: 100,
                expiry_date: 'June 15, 2021',
                recive_type: 'Completed Quiz #05',
                image: '',
            },
            {
                amount_recived: 100,
                expiry_date: 'June 15, 2021',
                recive_type: 'Completed Quiz #05',
                image: '',
            },
            {
                amount_recived: 100,
                expiry_date: 'June 15, 2021',
                recive_type: 'Completed Quiz #05',
                image: '',
            },
        ],
    }

    const [neoCash, setNeoCash] = useState(props.route.params.data);
    const [pointsDetails, setPointsDetails] = useState(mockData);
    // console.log('DATA', neoCash);

    const cashHistory = (item, index) => {
        return(
            <View>
                <View style={[commonStyles.rowSpaceBetween, {marginBottom:15}]}>
                    <View>
                        <View>
                            <Image style={style.logoImage} source={require("../../assets/images/Ellipse_18.png")}/>
                        </View>
                        <View>
                            {/* <Image style={style.logoInnerImage} source={require("../../assets/images/noun_Add_Wallet_887786.png")}/> */}
                        </View>
                    </View>
                    <View>
                        <Text style={texts.darkGreyTextBold14}>{item.recive_type}</Text>
                        <Text style={texts.greyNormal12}>{'Expires on '}{item.expiry_date}</Text>
                    </View>
                    <View>
                        <Text style={texts.greenNormal13}>{'₹'}{item.amount_recived}</Text>
                        <Text style={texts.darkGreyNormal12}>31 May</Text>
                    </View>
                </View>
            </View>
        );
    }

    const cashExpire = (item, index) => {
        return(
            <View>
                <ScrollView>
                    <View style={[commonStyles.rowSpaceBetween, {marginTop:10}]}>
                        <Text style={texts.lightRedNormal16}>{'₹'}{item.amount_recived}</Text>
                        <Text style={texts.darkGreyNormal12}>{'Expiring on'}{item.expiry_date}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <SecondaryHeader title={"NeoCash"}/>
            <View style={{backgroundColor:'#F2F2F2', padding:30, marginTop:20, borderRadius:5}}>
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
            <View>
                <FlatList 
                    data={pointsDetails.offerDetails}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id + ""}
                    renderItem={({item, index}) =>cashExpire(item, index)}
                />
            </View>
            <View style={{marginTop:20}}>
                <Text style={texts.blackTextBold16}>Transaction History</Text>
            </View>
            <View style={{marginTop:10}}>
                <FlatList 
                    data={pointsDetails.offerDetails}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id + ""}
                    renderItem={({item, index}) =>cashHistory(item, index)}
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    logoImage: {
        height: 50,
        width: 50,
    },
    logoInnerImage: {
        height: 30,
        width: 30,
    },

})