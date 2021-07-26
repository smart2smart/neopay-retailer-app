/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import RetailerDetails from '../screens/details/RetailerDetails';
import CreateOrder from '../screens/order/CreateOrder';
import AddressDetails from '../screens/details/AddressDetails';
import BusinessInfo from '../screens/details/BusinessInfo';
import MapViewScreen from "../commons/MapView";
import Drawer from "./Drawer";
import HomeScreen from "../screens/home/HomeScreen";
import UploadImage from "../screens/details/UploadImage";
import EditProfile from "../screens/profile/EditProfile";
import ProfileScreen from "../screens/profile/ProfileScreen";


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
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
      <Stack.Screen name="RetailerDetails" component={RetailerDetails} />
      <Stack.Screen name="CreateOrder" component={CreateOrder} />
      <Stack.Screen name="AddressDetails" component={AddressDetails} />
      <Stack.Screen name="BusinessInfo" component={BusinessInfo} />
      <Stack.Screen name="MapView" component={MapViewScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="UploadImage" component={UploadImage} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
