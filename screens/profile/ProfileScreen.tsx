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


export default function ProfileScreen() {

    const navigation = useNavigation();
    const route = useRoute();

    const [retailerData, setRetailerData] = useState({});

    useEffect(() => {
        retailerDetails();
    }, [])

    const retailerDetails = () => {
        const data = {
            method: commonApi.getRetailerDetails.method,
            url: commonApi.getRetailerDetails.url,
            header: commonApi.getRetailerDetails.header,
        }
        AuthenticatedGetRequest(data).then((res) => {
            console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
            console.log(res)
            setRetailerData(res.data);
        })
    }

    const goToEditProfile = () => {
        navigation.navigate('EditProfile', {data: retailerData, comingFrom: "edit"})
    }

    const goToBuildOrder = () => {
        let data = {
            contact_no: retailerData.contact_no,
            id: retailerData.id,
            contact_person_name: retailerData.contact_person_name,
            name: retailerData.name,
        }
        navigation.navigate('build-order', {data: data})
    }

    return (
        <View style={style.container}>
            <View style={{paddingHorizontal: 24, paddingBottom: 10}}>
                <SecondaryHeader title={"Profile"}/>
            </View>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                <View>
                    {retailerData.attachment ?
                        <View style={commonStyles.imageContainer}>
                            <Image source={{uri: retailerData.attachment}}
                                   style={{width: '100%', height: '100%'}}/>
                        </View> :
                        <View style={commonStyles.imageContainer}>
                            <Text style={[texts.darkGrey18Bold, {marginBottom: 50}]}>
                                Image not available
                            </Text>
                        </View>}
                </View>
                <View style={{
                    position: "relative",
                    height: 210,
                    paddingHorizontal: 24,
                    justifyContent: 'flex-end',
                    paddingBottom: 20
                }}>
                    <View style={style.textContainer}>
                        <Text style={[texts.blackTextBold18]}>
                            {retailerData.name}
                        </Text>
                        <View style={commonStyles.rowSpaceBetween}>
                            <View>
                                <Text style={[texts.greyNormal14, {marginTop: 10}]}>
                                    Contact Person : {retailerData.contact_person_name}
                                </Text>
                                <Text style={[texts.greyNormal14, {marginTop: 10}]}>
                                    Phone No : {retailerData.contact_no}
                                </Text>
                            </View>
                            <Image style={style.phoneIcon} source={require('../../assets/images/Group_590.png')}/>
                        </View>
                        {retailerData.address_data ?
                            <Text style={[texts.greyNormal14, , {marginTop: 10, lineHeight: 20}]}>
                                Address
                                : {retailerData.address_data.line_1}, {retailerData.address_data.line_2},
                                {' ' + retailerData.address_data.city.name}, {' ' + retailerData.address_data.state.name},
                                {' ' + retailerData.address_data.pincode.pincode}
                            </Text> : null}
                        <View style={style.underline}>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <BorderButtonSmallRed ctaFunction={goToEditProfile} text={"Edit Profile"}/>
                            <View style={{marginLeft: 16}}>
                                <BlueButtonSmall ctaFunction={goToBuildOrder} text={"Build Order"}/>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    textContainer: {
        padding: 16,
        borderRadius: 5,
        borderColor: colors.grey,
        backgroundColor: '#ffffff',
        elevation: 2,
        position: 'absolute',
        width: Dimensions.get("window").width - 48,
        marginHorizontal: 24,
        top: -50
    },
    textInputDiv: {
        paddingBottom: 30
    },
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        fontFamily: "GothamMedium",
        borderWidth: 0,
        borderColor: 'transparent',
        width: '100%',
        height: 40,
        padding: 0
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        marginVertical: 20
    },
    headerTabsContainer: {
        marginBottom: 16,
        paddingTop: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey,
    },
    headerItem: {
        marginRight: 20,
        paddingVertical: 4,
    },
    headerItemSelected: {
        backgroundColor: colors.primary_theme_color,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginRight: 20
    },
    phoneIcon: {
        width: 24,
        height: 24,
// backgroundColor:colors.darkGrey
    },
});
