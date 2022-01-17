import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {lazy, Suspense} from 'react';
import {ColorSchemeName} from 'react-native';
import {RootStackParamList} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import {setLandingScreen} from "../actions/actions";
import mapStateToProps from "../store/mapStateToProps";
import {commonApi} from "../api/api";
import {AuthenticatedGetRequest} from "../api/authenticatedGetRequest";
import store from "../store/store";
import {useEffect, useState} from "react";
import {connect, useSelector} from "react-redux";

const RetailerDetails = lazy(() => import('../screens/details/RetailerDetails'));
const BusinessInfo = lazy(() => import('../screens/details/BusinessInfo'));
const UploadImage = lazy(() => import('../screens/details/UploadImage'));
const EditProfile = lazy(() => import('../screens/profile/EditProfile'));
const AddressDetails = lazy(() => import('../screens/details/AddressDetails'));
const MapViewScreen = lazy(() => import('../screens/details/MapViewScreen'));
const ProductDescription = lazy(() => import('../screens/productDetails/ProductDescription'));
const NeoCash = lazy(() => import('../screens/neoCash/NeoCash'));
const Offer = lazy(() => import('../screens/offer/Offer'));
const OfferDetails = lazy(() => import('../screens/offer/OfferDetails'));
const OrderListDetails = lazy(() => import('../screens/orderList/OrderListDetails'));
const VerificationPending = lazy(() => import('../screens/VerificationPending'));
const SelectDistributor = lazy(() => import('../screens/home/SelectDistributor'));
const BrandList = lazy(() => import('../screens/home/BrandList'));
const BuildOrder = lazy(() => import('../screens/home/BuildOrder'));
const Drawer = lazy(() => import('./Drawer'));

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
        initialScreen = "Home"
    } else if (landingScreen === "home") {
        initialScreen = "Home"
    }
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
            setFetchingData(false);
            if (res.status == 200) {
                store.dispatch({
                    type: 'RETAILER_DETAILS', payload: res.data
                })
                setVerificationStatus(res.data.verification_status);
            }
        })
    }

    if (fetchingData) {
        return null;
    }

    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {initialScreen === "Home" ? (verificationStatus == 2 || verificationStatus == 3) ? <RootNavigator/> :
                <UserUnverifiedNavigator/> : <ProfileNavigator initialScreen={initialScreen}/>}
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
        <Suspense fallback={<div>Loading... </div>}>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
            <RootStack.Screen key={"HomeScreen"} options={{headerShown:false}} name={"HomeScreen"} component={Drawer}/>
            <RootStack.Screen name="MapViewScreen" component={MapViewScreen}/>
            <RootStack.Screen name="EditProfile" component={EditProfile}/>
            <RootStack.Screen name="UploadImage" component={UploadImage}/>
            <RootStack.Screen name="ProductDescription" component={ProductDescription}/>
            <RootStack.Screen name="NeoCash" component={NeoCash}/>
            <RootStack.Screen name="Offer" component={Offer}/>
            <RootStack.Screen name="OfferDetails" component={OfferDetails}/>
            <RootStack.Screen name="OrderListDetails" component={OrderListDetails}/>
            <RootStack.Screen name="SelectDistributor" component={SelectDistributor}/>
            <RootStack.Screen name="BrandList" component={BrandList}/>
            <RootStack.Screen name="BuildOrder" component={BuildOrder}/>
        </RootStack.Navigator>
        </Suspense>
    );
}

function ProfileNavigator(props) {
    return (
        <Suspense fallback={<div>Loading... </div>}>
        <ProfileStack.Navigator initialRouteName={props.initialScreen} screenOptions={{headerShown: false}}>
            <ProfileStack.Screen name="RetailerDetails" component={RetailerDetails}/>
            <ProfileStack.Screen name="AddressDetails" component={AddressDetails}/>
            <ProfileStack.Screen name="BusinessInfo" component={BusinessInfo}/>
            <ProfileStack.Screen name="MapViewScreen" component={MapViewScreen}/>
            <ProfileStack.Screen name="UploadImage" component={UploadImage}/>
        </ProfileStack.Navigator>
        </Suspense>
    );
}


function UserUnverifiedNavigator(props) {
    return (
        <Suspense fallback={<div>Loading... </div>}>
        <UserUnverifiedStack.Navigator initialRouteName={props.initialScreen} screenOptions={{headerShown: false}}>
            <UserUnverifiedStack.Screen name  ="VerificationPending" component={VerificationPending}/>
        </UserUnverifiedStack.Navigator>
        </Suspense>
    );
}

export default connect(mapStateToProps, {setLandingScreen})(Navigation)
