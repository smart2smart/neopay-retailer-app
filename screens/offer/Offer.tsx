import React, {Component, useEffect, useState} from 'react';
import {View, StyleSheet, Text,FlatList, Image, ScrollView, TouchableOpacity} from "react-native";
import texts from "@texts";
import PrimaryHeader from "@headers/PrimaryHeader";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '@commonStyles';
import { BorderButtonBigRed } from '@Buttons';
import colors from "@colors";

export default function Offer(props:any) {

    const mockData = {
        productOffer: 
        [
            {
                image: '',
                company_name: 'C&C Products',
                discount: '15% OFF',
                offer_till: '3 June 2021',
                discription: 'Offer Discription Lorem Ipsum',
                Rewards:'',
                hot_deal:'BOGO',
            },
            {
                image: '',
                company_name: 'C&C Products',
                discount: '15% OFF',
                offer_till: '3 June 2021',
                discription: 'Offer Discription Lorem Ipsum',
                Rewards:'',
                hot_deal:'',
            },
            {
                image: '',
                company_name: 'C&C Products',
                discount: '15% OFF',
                offer_till: '3 June 2021',
                discription: 'Offer Discription Lorem Ipsum',
                Rewards:'',
                hot_deal:'',
            },
            {
                image: '',
                company_name: 'C&C Products',
                discount: '15% OFF',
                offer_till: '3 June 2021',
                discription: 'Offer Discription Lorem Ipsum',
                Rewards:'',
                hot_deal:'',
            },
            {
                image: '',
                company_name: 'C&C Products',
                discount: '15% OFF',
                offer_till: '3 June 2021',
                discription: 'Offer Discription Lorem Ipsum',
                Rewards:'',
                hot_deal:'',
            },
            {
                image: '',
                company_name: 'C&C Products',
                discount: '15% OFF',
                offer_till: '3 June 2021',
                discription: 'Offer Discription Lorem Ipsum',
                Rewards:'',
                hot_deal:'',
            },
            {
                image: '',
                company_name: 'C&C Products',
                discount: '15% OFF',
                offer_till: '3 June 2021',
                discription: 'Offer Discription Lorem Ipsum',
                Rewards:'',
                hot_deal:'',
            },
            {
                image: '',
                company_name: 'C&C Products',
                discount: '15% OFF',
                offer_till: '3 August 2021',
                discription: 'Offer Discription Lorem Ipsum',
                Rewards:'',
                hot_deal:'',
            },
        ]
    }

    const navigation = useNavigation();
    const [offer, setOffer] = useState(mockData);

    const offerDetails = (item) => {
        navigation.navigate("OfferDetails", {data: item});
    }

    const renderOffer = (item,index) => {
        return(
            <ScrollView style={{backgroundColor:'#F6F6F6',  width:'50%'}}>
                <TouchableOpacity onPress={() => offerDetails(item)} style={{margin:20,borderRadius:5, backgroundColor:colors.white, padding:10}}>
                    {/* <Image style={styles.cardImage} source={{uri: item.image}}/> */}
                    <View>
                        <View>
                            <Image style={styles.cardImage} source={require("../../assets/images/adaptive-icon.png")}/>
                        </View>
                        <View style={{position:'absolute', alignSelf:'flex-end', backgroundColor:'#D68060', borderRadius:4}}>
                            {item.hot_deal ? <Text style={texts.whiteNormal12}> {item.hot_deal} </Text> : null }
                        </View>
                    </View>
                    <View style={{marginVertical:5, alignSelf:'center'}}>
                        <Text style={texts.darkGreyNormal14}>{item.company_name}</Text>
                    </View>
                    <View style={{backgroundColor:'#F1EBF6', borderRadius:5, margin:3, alignItems:'center'}}>
                        <Text style={texts.blueNormal15}>{item.discount}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    return(
        <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: colors.white }}>
            {/* <PrimaryHeader navigation={props.navigation}/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={texts.blackTextBold18}>
                    COMING SOON
                </Text>
            </View>  */}
            <View style={{marginVertical:25}}>
                <Text style={texts.blackTextBold16}>OFFERS</Text>
            </View>
            <View>
                <FlatList
                    data={offer.productOffer}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    keyExtractor={(item) => item.id + ""}
                    renderItem={({item, index}) =>renderOffer(item, index)}
                    ListFooterComponent = {<View style={{paddingBottom:80}}></View>}
                />
            </View>
            {/* <View style={{backgroundColor:'#F6F6F6', borderRadius:5, padding:20, display:'flex', flexDirection:'row'}}>
                <View style={{margin:20, backgroundColor:colors.white}}>
                    <Image style={styles.cardImage} source={require("../assets/images/adaptive-icon.png")}/>
                    <Text style={texts.darkGreyNormal14}>C&C Products</Text>
                    <View style={{backgroundColor:'#F1EBF6', borderRadius:5, margin:3}}>
                        <Text>15% OFF</Text>
                    </View>
                </View>
                <View style={{margin:20, backgroundColor:colors.white}}>
                    <Image style={styles.cardImage} source={require("../assets/images/adaptive-icon.png")}/>
                    <Text style={texts.darkGreyNormal14}>C&C Products</Text>
                    <View style={{backgroundColor:'#F1EBF6', borderRadius:5, margin:3}}>
                        <Text>15% OFF</Text>
                    </View>
                </View>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    cardImage: {
        height: 105,
        width: 105,
        backgroundColor: colors.light_grey,
        alignSelf:'center'
    },
})
