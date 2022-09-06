/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { Alert, ColorSchemeName } from "react-native";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import RetailerDetails from "../screens/details/RetailerDetails";
import BusinessInfo from "../screens/details/BusinessInfo";
import Drawer from "./Drawer";
import UploadImage from "../screens/details/UploadImage";
import EditProfile from "../screens/profile/EditProfile";
import { connect, useSelector } from "react-redux";
import AddressDetails from "../screens/details/AddressDetails";
import MapViewScreen from "../screens/details/MapViewScreen";
import ProductDescription from "../screens/productDetails/ProductDescription";
import NeoCash from "../screens/neoCash/NeoCash";
import Offer from "../screens/offer/Offer";
import OfferDetails from "../screens/offer/OfferDetails";
import OrderListDetails from "../screens/orderList/OrderListDetails";
import { setLandingScreen } from "../actions/actions";
import mapStateToProps from "../store/mapStateToProps";
import { authApi, commonApi } from "../api/api";
import { AuthenticatedGetRequest } from "../api/authenticatedGetRequest";
import store from "../store/store";
import { useEffect, useState } from "react";
import VerificationPending from "../screens/VerificationPending";
import SelectDistributor from "../screens/home/SelectDistributor";
import BrandList from "../screens/home/BrandList";
import ProductFilterScreen from "../screens/home/ProductFilterScreen";
import PersistenceStore from "../utils/PersistenceStore";
import * as Analytics from "expo-firebase-analytics";
import * as Application from "expo-application";
import Constants from "expo-constants";
import BuildOrder from "../screens/build-order/BuildOrder";
import Cart from "../screens/cart/Cart";
import SearchScreen from "../screens/build-order/SearchScreen";
import NotificationScreen from "../screens/notifications";

function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const landingScreen = useSelector((state: any) => state.landingScreen);
  const retailerDetails = useSelector((state: any) => state.retailerDetails);
  const userType = useSelector((state: any) => state.userType);
  const routeNameRef = React.createRef();
  const navigationRef = React.createRef();

  let initialScreen = "";
  if (landingScreen === "profile") {
    initialScreen = "RetailerDetails";
  } else if (landingScreen === "address") {
    initialScreen = "AddressDetails";
  } else if (landingScreen === "license") {
    initialScreen = "Home";
  } else if (landingScreen === "home") {
    initialScreen = "Home";
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          Analytics.logEvent("view_screen", {
            screenName: currentRouteName,
            userId: retailerDetails?.user,
            userName: retailerDetails?.name,
            androidId: Application.androidId,
            appVersion: Constants.manifest?.version,
            appVersionCode: Constants.manifest?.android?.versionCode,
            androidVersion: Constants.systemVersion,
          });
        }

        routeNameRef.current = currentRouteName;
      }}
      linking={LinkingConfiguration}
      // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      theme={DefaultTheme}
    >
      {initialScreen === "Home" ? (
        retailerDetails?.verification_status == 2 ||
        retailerDetails?.verification_status == 3 ? (
          <RootNavigator />
        ) : (
          <UserUnverifiedNavigator retailerDetails={retailerDetails} />
        )
      ) : (
        <ProfileNavigator initialScreen={initialScreen} />
      )}
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
      <RootStack.Screen
        key={"HomeScreen"}
        options={{ headerShown: false }}
        name={"HomeScreen"}
        component={Drawer}
      />
      <RootStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <RootStack.Screen name="MapViewScreen" component={MapViewScreen} />
      <RootStack.Screen name="EditProfile" component={EditProfile} />
      <RootStack.Screen name="UploadImage" component={UploadImage} />
      <RootStack.Screen
        name="ProductDescription"
        component={ProductDescription}
      />
      <RootStack.Screen name="NeoCash" component={NeoCash} />
      <RootStack.Screen name="Offer" component={Offer} />
      <RootStack.Screen name="OfferDetails" component={OfferDetails} />
      <RootStack.Screen name="OrderListDetails" component={OrderListDetails} />
      <RootStack.Screen
        name="SelectDistributor"
        component={SelectDistributor}
      />
      <RootStack.Screen name="BrandList" component={BrandList} />
      <RootStack.Screen name="Cart" component={Cart} />
      <RootStack.Screen name="notifications" component={NotificationScreen} />
      <RootStack.Screen name="search-sku" component={SearchScreen} />
      <RootStack.Screen name="BuildOrder" component={BuildOrder} />
      <RootStack.Screen
        name="ProductFilterScreen"
        component={ProductFilterScreen}
      />
    </RootStack.Navigator>
  );
}

function ProfileNavigator(props) {
  return (
    <ProfileStack.Navigator
      initialRouteName={props.initialScreen}
      screenOptions={{ headerShown: false }}
    >
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
    <UserUnverifiedStack.Navigator
      initialRouteName={props.initialScreen}
      screenOptions={{ headerShown: false }}
    >
      <UserUnverifiedStack.Screen
        initialParams={{ retailerDetails: props.retailerDetails }}
        name="VerificationPending"
        component={VerificationPending}
      />
    </UserUnverifiedStack.Navigator>
  );
}

export default connect(mapStateToProps, { setLandingScreen })(Navigation);
