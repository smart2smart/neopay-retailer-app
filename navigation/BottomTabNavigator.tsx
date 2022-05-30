import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import Entypo from "react-native-vector-icons/Entypo";
import Octicons from "react-native-vector-icons/Octicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useColorScheme from "../hooks/useColorScheme";
import colors from "../assets/colors/colors";
import Cart from "../screens/cart/Cart";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import OrderList from "../screens/orderList/OrderList";

const BottomTabsStack = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTabsStack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let icon = null;
          switch (route.name) {
            case "Home":
              icon = (
                <Entypo
                  name="home"
                  size={18}
                  color={focused ? colors.primaryThemeColor : colors.lightGrey}
                />
              );
              break;
            case "Cart":
              icon = (
                <EvilIcons
                  name="cart"
                  size={25}
                  color={focused ? colors.primaryThemeColor : colors.lightGrey}
                />
              );
              break;
            case "Orders":
              icon = (
                <Octicons
                  name="file"
                  size={18}
                  color={focused ? colors.primaryThemeColor : colors.lightGrey}
                />
              );
              break;
            case "Account":
              icon = (
                <MaterialIcons
                  name="account-circle"
                  size={22}
                  color={focused ? colors.primaryThemeColor : colors.lightGrey}
                />
              );
              break;
          }

          return icon;
        },
      })}
      defaultScreenOptions={{
        tabBarActiveTintColor: colors.primaryThemeColor,
        tabBarInactiveTintColor: "#333",
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "GothamMedium",
        },
        tabBarStyle: [
          {
            paddingBottom: 6,
            height: 56,
            backgroundColor: "#F8F8F8",
          },
        ],
      }}
    >
      <BottomTabsStack.Screen name="Home" component={HomeScreen} />
      <BottomTabsStack.Screen name="Cart" component={Cart} />
      <BottomTabsStack.Screen name="Orders" component={OrderList} />
      <BottomTabsStack.Screen name="Account" component={ProfileScreen} />
    </BottomTabsStack.Navigator>
  );
}
