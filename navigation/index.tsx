/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {ColorSchemeName} from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import {RootStackParamList} from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import RetailerDetails from '../screens/details/RetailerDetails';
import ProductList from '../screens/order/ProductList';
import BusinessInfo from '../screens/details/BusinessInfo';
import Drawer from "./Drawer";
import HomeScreen from "../screens/home/HomeScreen";
import UploadImage from "../screens/details/UploadImage";
import EditProfile from "../screens/profile/EditProfile";
import ProfileScreen from "../screens/profile/ProfileScreen";
import {connect, useSelector} from "react-redux";
import AddressDetails from "../screens/details/AddressDetails";
import MapViewScreen from "../screens/details/MapViewScreen";
import ProductDescription from "../screens/productDetails/ProductDescription";
import NeoCash from "../screens/neoCash/NeoCash";
import Cart from "../screens/cart/Cart";
import Offer from "../screens/offer/Offer";
import OfferDetails from "../screens/offer/OfferDetails";
import OrderListDetails from "../screens/orderList/OrderListDetails";
import {setLandingScreen} from "../actions/actions";
import mapStateToProps from "../store/mapStateToProps";
import {commonApi} from "../api/api";
import {AuthenticatedGetRequest} from "../api/authenticatedGetRequest";
import store from "../store/store";
import {useEffect, useState} from "react";
import VerificationPending from "../screens/VerificationPending";


function Navigation({colorScheme,}: { colorScheme: ColorSchemeName }) {
    const [verificationStatus, setVerificationStatus] = useState(1);
    const [fetchingData, setFetchingData] = useState(true);
    const landingScreen = useSelector((state: any) => state.landingScreen);
    let initialScreen = "";
    if (landingScreen === "profile") {
        initialScreen = "RetailerDetails"
    } else if (landingScreen === "address") {
        initialScreen = "AddressDetails"
    } else if (landingScreen === "license") {
        initialScreen = "BusinessInfo"
    } else if (landingScreen === "home") {
        initialScreen = "Home"
    }
    useEffect(()=>{
        retailerDetails();
    }, [])

    const retailerDetails = () => {
        const data = {
            method: commonApi.getRetailerDetails.method,
            url: commonApi.getRetailerDetails.url,
            header: commonApi.getRetailerDetails.header,
        }
        AuthenticatedGetRequest(data).then((res) => {
            setFetchingData(false);
            if(res.status==200){
                store.dispatch({
                    type: 'RETAILER_DETAILS', payload: res.data
                })
                setVerificationStatus(res.data.verification_status);
            }
        })
    }

    if(fetchingData){
        return null;
    }

    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {initialScreen==="Home"?(verificationStatus == 2 || verificationStatus ==3)?<RootNavigator/>:
                <UserUnverifiedNavigator />:<ProfileNavigator  initialScreen={initialScreen}/>}
        </NavigationContainer>
    );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const RootStack = createStackNavigator<RootStackParamList>();
const ProfileStack = createStackNavigator<RootStackParamList>();
const UserUnverifiedStack = createStackNavigator<RootStackParamList>();

function RootNavigator(props) {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen key={"Home"} options={{headerShown:false}}  name={"Home"} component={Drawer} />
      <RootStack.Screen name="Root" component={BottomTabNavigator} />
      <RootStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <RootStack.Screen name="ProductList" component={ProductList} />
      <RootStack.Screen name="MapViewScreen" component={MapViewScreen} />
      <RootStack.Screen name="HomeScreen" component={HomeScreen} />
      <RootStack.Screen name="EditProfile" component={EditProfile} />
      <RootStack.Screen name="UploadImage" component={UploadImage} />
      <RootStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <RootStack.Screen name="Cart" component={Cart} />
      <RootStack.Screen name="ProductDescription" component={ProductDescription} />
      <RootStack.Screen name="NeoCash" component={NeoCash} />
      <RootStack.Screen name="Offer" component={Offer} />
      <RootStack.Screen name="OfferDetails" component={OfferDetails} />
      <RootStack.Screen name="OrderListDetails" component={OrderListDetails} />
    </RootStack.Navigator>
  );
}

function ProfileNavigator(props) {
    return (
        <ProfileStack.Navigator initialRouteName={props.initialScreen} screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="RetailerDetails" component={RetailerDetails} />
            <ProfileStack.Screen name="AddressDetails" component={AddressDetails} />
            <ProfileStack.Screen name="BusinessInfo" component={BusinessInfo} />
            <ProfileStack.Screen name="MapViewScreen" component={MapViewScreen} />
            <ProfileStack.Screen name="UploadImage" component={UploadImage} />
        </ProfileStack.Navigator>
    );
}


function UserUnverifiedNavigator(props) {
    return (
        <UserUnverifiedStack.Navigator initialRouteName={props.initialScreen} screenOptions={{ headerShown: false }}>
            <UserUnverifiedStack.Screen name="VerificationPending" component={VerificationPending} />
        </UserUnverifiedStack.Navigator>
    );
}

export default connect(mapStateToProps, {setLandingScreen})(Navigation)

