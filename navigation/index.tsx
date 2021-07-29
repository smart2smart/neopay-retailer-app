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
import StoreDetails from '../screens/details/StoreDetails';
import CreateOrder from '../screens/order/CreateOrder';
import BusinessInfo from '../screens/details/BusinessInfo';
import Drawer from "./Drawer";
import HomeScreen from "../screens/home/HomeScreen";
import UploadImage from "../screens/details/UploadImage";
import EditProfile from "../screens/profile/EditProfile";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ReviewCart from "../screens/order/ReviewCart";
import {useSelector} from "react-redux";
import AddressDetails from "../screens/details/AddressDetails";
import MapViewScreen from "../screens/details/MapViewScreen";
import ProductDescription from "../screens/productDetails/ProductDescription";
import NeoCash from "../screens/neoCash/NeoCash";


export default function Navigation({colorScheme,}: { colorScheme: ColorSchemeName }) {
    const landingScreen = useSelector((state: any) => state.landingScreen);
    let initialScreen = "";
    if (landingScreen === "profile") {
        initialScreen = "StoreDetails"
    } else if (landingScreen === "address") {
        initialScreen = "AddressDetails"
    } else if (landingScreen === "license") {
        initialScreen = "BusinessInfo"
    } else if (landingScreen === "home") {
        initialScreen = "Home"
    }
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator initialScreen={initialScreen}/>
        </NavigationContainer>
    );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen key={"Home"} options={{headerShown:false}}  name={"Home"} component={Drawer} />
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="RetailerDetails" component={StoreDetails} />
      <Stack.Screen name="CreateOrder" component={CreateOrder} />
      <Stack.Screen name="AddressDetails" component={AddressDetails} />
      <Stack.Screen name="BusinessInfo" component={BusinessInfo} />
      <Stack.Screen name="MapView" component={MapViewScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="UploadImage" component={UploadImage} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ReviewCart" component={ReviewCart} />
      <Stack.Screen name="ProductDescription" component={ProductDescription} />
      <Stack.Screen name="NeoCash" component={NeoCash} />
    </Stack.Navigator>
  );
}
