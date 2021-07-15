import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useColorScheme from '../hooks/useColorScheme';
import colors from "../assets/colors/colors";
import ComingSoon from "../screens/ComingSoon";
import {HomeScreen} from "../screens/home/HomeScreen";
import {ProfileScreen} from "../screens/profile/ProfileScreen";

const BottomTabsStack = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTabsStack.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let icon = null;
                    switch (route.name) {
                        case 'Home':
                            icon = <Entypo name="home" size={18} color={focused?colors.primary_color:colors.grey}/>
                            break;
                        case 'Reports':
                            icon = <Octicons name="file" size={18} color={focused?colors.primary_color:colors.grey} />
                            break;
                        case 'Search':
                            icon = <AntDesign name="search1" size={18} color={focused?colors.primary_color:colors.grey} />
                            break;
                        case 'Profile':
                            icon = <MaterialIcons name="account-circle" size={22} color={focused?colors.primary_color:colors.grey} />
                            break;
                    }

                    return icon
                },
            })}
            tabBarOptions={{
                activeTintColor: colors.primary_color,
                inactiveTintColor: '#909090',
                style: {
                    paddingBottom: 6,
                    height: 56,
                    backgroundColor: '#F8F8F8'
                },
                labelStyle: {
                    fontSize: 12,
                    fontFamily: '' +
                        'GothamMedium'
                }
            }}>
            <BottomTabsStack.Screen
                name="Home"
                component={HomeScreen}/>
            <BottomTabsStack.Screen
                name="Reports"
                component={ComingSoon}/>
            <BottomTabsStack.Screen
                name="Search"
                component={ComingSoon}/>
            <BottomTabsStack.Screen
                name="Profile"
                component={ProfileScreen}/>
        </BottomTabsStack.Navigator>
    );
}
