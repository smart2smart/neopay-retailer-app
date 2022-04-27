import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl
} from 'react-native';
// @ts-ignore
import colors from "../../assets/colors/colors";
import commonStyles from "../../styles/commonStyles";
import texts from "../../styles/texts";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useRoute} from '@react-navigation/native';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import {BlueButtonSmall, BorderButtonSmallRed} from "../../buttons/Buttons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Indicator from "../../utils/Indicator";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import PrimaryHeader from "../../headers/PrimaryHeader";


export default function ProfileScreen(props) {

    const navigation = useNavigation();
    const route = useRoute();

    useFocusEffect(
        React.useCallback(() => {
            retailerDetails();
        }, [])
    );


    useEffect(() => {
        if (route.params) {
            if (route.params.comingFrom == "image") {
                setData(route.params.data);
            }
            if (route.params.comingFrom == "map") {
                updateLocation(route.params.location);
            }
        } else {
            retailerDetails();
        }
    }, [route.params]);

    const updateLocation = (location) => {
        let address = {};
        let data = {};
        if (location.latitude) {
            address["latitude"] = location.latitude;
        }
        if (location.longitude) {
            address["longitude"] = location.longitude;
        }
        data["address"] = JSON.stringify(address)
        const dataToSend = {
            method: commonApi.updateRetailerProfile.method,
            url: commonApi.updateRetailerProfile.url,
            header: commonApi.updateRetailerProfile.header,
            data: data
        }
        AuthenticatedPostRequest(dataToSend).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                Alert.alert("Details updated successfully.");
                setData(res);
            } else {
                Alert.alert(res.data.message);
            }
        })
    }


    const [refreshing, setRefreshing] = useState(false);
    const [retailerData, setRetailerData] = useState({});
    const [loading, setIsLoading] = useState(false);
    const [address, setAddress] = useState("");

    const retailerDetails = () => {
        const data = {
            method: commonApi.getRetailerDetails.method,
            url: commonApi.getRetailerDetails.url,
            header: commonApi.getRetailerDetails.header,
        }
        setIsLoading(true);
        AuthenticatedGetRequest(data).then((res) => {
            setData(res);
            setIsLoading(false)
        })
    }

    const setData = (res) => {
        setRetailerData(res.data);
        let address = "";
        if (res.data.address_data) {
            address += res.data.address_data.line_1;
            address += ", " + res.data.address_data.line_2;
            if (res.data.address_data.city) {
                address += ", " + res.data.address_data.city.name;
            }
            if (res.data.address_data.state) {
                address += ", " + res.data.address_data.state.name;
            }
            if (res.data.address_data.pincode) {
                address += ", " + res.data.address_data.pincode.pincode;
            }
        }
        setAddress(address)
    }

    const orderDetails = () => {
        navigation.navigate('Orders');
    }

    const goToMapView = () => {
        let currentLocation = {latitude:retailerData.address_data.latitude, longitude: retailerData.address_data.longitude}
        navigation.navigate('MapViewScreen', {comingFrom: "profile", addressId: retailerData.address_data.id,  currentLocation:currentLocation});
    }

    const goToEditProfile = () => {
        navigation.navigate('EditProfile', {data: retailerData, comingFrom: "edit", image:retailerData.attachment})
    }

    const goToUploadImage = () => {
        navigation.navigate('UploadImage', {comingFrom: 'profile', data: retailerData});
    }

    return (
        <View style={style.container}>
            <Indicator isLoading={loading}/>
            <PrimaryHeader navigation={props.navigation}/>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        retailerDetails();
                    }}
                />
            } style={{flex: 1}} showsVerticalScrollIndicator={false}>
                <View>
                    {retailerData.attachment ?
                        <View style={commonStyles.imageContainer}>
                            <Image source={{uri: retailerData.attachment}}
                                   style={{width: '100%', height: '100%'}}/>
                            <TouchableOpacity onPress={goToUploadImage} style={style.editButtonDiv}>
                                <MaterialIcons name="edit" size={24} color={colors.red}/>
                            </TouchableOpacity>
                        </View> :
                        <View style={commonStyles.imageContainer}>
                            <Text style={[texts.darkGrey18Bold, {marginBottom: 50}]}>
                                Image not available
                            </Text>
                            <TouchableOpacity onPress={goToUploadImage} style={style.editButtonDiv}>
                                <MaterialIcons name="edit" size={24} color={colors.red}/>
                            </TouchableOpacity>
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
                        </View>
                        {retailerData.address_data ?
                            <Text style={[texts.greyNormal14, , {marginTop: 10, lineHeight: 20}]}>
                                Address
                                : {address}
                            </Text> : null}
                        <View style={style.underline}>
                        </View>
                        <View style={commonStyles.rowSpaceBetween}>
                            {retailerData.address_data && retailerData.address_data.latitude != 0 ?
                                <View>
                                    <View>
                                        <Text
                                            style={texts.greyTextBold14}>{retailerData.address_data.latitude.toString().substring(0, 10)}, </Text>
                                        <Text
                                            style={texts.greyTextBold14}>{retailerData.address_data.longitude.toString().substring(0, 10)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={goToMapView}>
                                        <Text style={[texts.redTextBold14, {textDecorationLine: "underline", paddingTop:5}]}>
                                            Change
                                        </Text>
                                    </TouchableOpacity>
                                </View> : <View>
                                    <BlueButtonSmall ctaFunction={goToMapView} text={"Location"}/>
                                </View>}
                            <View style={commonStyles.row}>
                                <BorderButtonSmallRed ctaFunction={goToEditProfile} text={"Edit Profile"}/>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity>
                    <View style={[style.textContainerWrapper, commonStyles.rowSpaceBetween]}>
                        <Text style={texts.blackTextBold14}>NeoCash Balance</Text>
                        <Text style={texts.redTextBold20}>₹ {retailerData.neo_cash}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => orderDetails()}
                                  style={[style.textContainerWrapper, commonStyles.rowSpaceBetween]}>
                    <Text style={texts.blackTextBold14}>My Orders</Text>
                    <Image style={style.phoneIcon} source={require('../../assets/images/Group_582.png')}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[style.textContainerWrapper, commonStyles.rowSpaceBetween]}>
                    <Text style={[texts.blackTextBold14,  {opacity:0.2}]}>Invoice</Text>
                    <Image style={style.phoneIcon} source={require('../../assets/images/Group_582.png')}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[style.textContainerWrapper, commonStyles.rowSpaceBetween, {marginBottom: 20}]}>
                    <Text style={[texts.blackTextBold14, {opacity:0.2}]}>Payments</Text>
                    <Image style={style.phoneIcon} source={require('../../assets/images/Group_582.png')}/>
                </TouchableOpacity>
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
        borderColor: colors.lightGrey,
        borderWidth:1,
        backgroundColor: '#ffffff',
        position: 'absolute',
        width: Dimensions.get("window").width - 48,
        marginHorizontal: 24,
        top: -50,
        zIndex:5000
    },
    textContainerWrapper: {
        padding: 16,
        borderRadius: 5,
        borderColor: colors.lightGrey,
        backgroundColor: '#ffffff',
        borderWidth:1,
        marginHorizontal: 24,
        width: Dimensions.get("window").width - 48,
        marginTop: 20,
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
    },
    editButtonDiv: {
        backgroundColor: colors.orangeFaded,
        borderWidth: 1,
        borderColor: colors.red,
        padding: 7,
        borderRadius: 2,
        position: 'absolute',
        right: 20,
        top: 20
    },
});
