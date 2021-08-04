import React, {Component, useEffect, useState} from 'react';
import {View, StyleSheet, Text,FlatList, Image, ScrollView, TouchableOpacity} from "react-native";
import texts from "../../styles/texts";
import PrimaryHeader from "../../headers/PrimaryHeader";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../../styles/commonStyles';
import { BorderButtonBigRed, SolidButtonBlue } from '../../buttons/Buttons';
import colors from "../../assets/colors/colors";
import SecondaryHeader from "../../headers/SecondaryHeader";

export default function OfferDetails(props:any) {

    const [offerData, setOfferData] = useState(props.route.params.data);
    
    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <View style={{}}>
                <SecondaryHeader title={"Offer Details"}/>
            </View>
            <ScrollView>
                <View>
                    <View style={{marginTop:20, position:'relative', height:180, backgroundColor:colors.light_pink}}>
                        <Image style={styles.cardImage} source={require("../../assets/images/adaptive-icon.png")}/>
                    </View>
                    <View style={{}}>
                        <Image style={styles.logoImage} source={require("../../assets/images/adaptive-icon.png")}/>
                    </View>
                </View>
                <View style={{marginTop:15}}>
                    <Text style={texts.lightRedBold24}>Get up to {offerData.discount}</Text>
                </View>
                <View style={{marginTop:8}}>
                    <Text style={texts.blackTextBold14}>Valid till {offerData.offer_till}</Text>
                    <View style={{marginTop:12}}>
                        <Text style={texts.darkGreyNormal12}>{offerData.discription}</Text>
                    </View>
                </View>
                <View style={{marginTop:15}}>
                    <Text style={texts.blackTextBold16}>Terms and Conditions</Text>
                </View>
                <View style={{marginTop:10}}> 
                    <Text style={texts.greyNormal12}>Offer Eligibility</Text>
                </View>
                <View style={{marginTop:5}}> 
                    <Text style={texts.greyNormal10}>{'• Lorem Ipsum Dolor'}</Text>
                    <Text style={texts.greyNormal10}>{'• Lorem Ipsum Dolor'}</Text>
                </View>
                <View style={{marginTop:10}}> 
                    <Text style={texts.greyNormal12}>Offer Duration</Text>
                </View>
                <View style={{marginTop:5}}> 
                    <Text style={texts.greyNormal10}>{'• Lorem Ipsum Dolor'}</Text>
                    <Text style={texts.greyNormal10}>{'• Lorem Ipsum Dolor'}</Text>
                </View>
                <View style={{marginTop:10}}> 
                    <Text style={texts.greyNormal12}>Rewards</Text>
                </View>
                <View style={{marginTop:5}}> 
                    <Text style={texts.greyNormal10}>{'• Lorem Ipsum Dolor'}</Text>
                    <Text style={texts.greyNormal10}>{'• Lorem Ipsum Dolor'}</Text>
                </View>
                <View style={{marginVertical:25}}>
                    <SolidButtonBlue text={'CLAIM OFFER'}/>
                </View>
            </ScrollView> 
        </View>
    );
}

const styles = StyleSheet.create({
    cardImage: {
        height: 200,
        width: '100%',
        backgroundColor: colors.light_grey,
        alignSelf:'center'
    },
    logoImage: {
        height: 60,
        width:60,
        borderRadius:100, 
        borderWidth:1, 
        borderColor:colors.light_grey,
        backgroundColor: colors.grey
    }
})
