import * as React from 'react';
import {createDrawerNavigator, DrawerContentScrollView} from "@react-navigation/drawer";
import {TouchableOpacity, View, Text, Alert, Dimensions} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import texts from "../styles/texts";
import store from "../store/store";
import PersistenceStore from "../utils/PersistenceStore";
import BottomTabNavigator from "./BottomTabNavigator";
import colors from "../assets/colors/colors";
import {setRetailerDetails} from "../actions/actions";
import mapStateToProps from "../store/mapStateToProps";
import {connect} from "react-redux";


const DrawerNavigator = createDrawerNavigator();

function Drawer() {
    return (
        <DrawerNavigator.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <DrawerNavigator.Screen key={"HomeScreen"} name={"HomeScreen"} component={BottomTabNavigator}/>
        </DrawerNavigator.Navigator>
    );
}

export default connect(mapStateToProps, {setRetailerDetails})(Drawer);


const LogOut = () => {
    Alert.alert(
        'LogOut',
        'Are you sure you want to logout?',
        [
            {
                text: 'Yes',
                onPress: () => {
                    store.dispatch({type: 'IS_LOGGED_IN', payload: false});
                    PersistenceStore.removeTimeStamp();
                    PersistenceStore.removeAccessToken();
                    PersistenceStore.removeRefreshToken();
                },
            },
            {text: 'No', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
    );
};


const RenderItem = (props) => <TouchableOpacity style={{
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
}} onPress={() => {
    props.onPress()
}}>
    <Text style={texts.darkGreyTextBold14}>
        {props.title}
    </Text>
    <View>
        <Ionicons name="ios-arrow-forward" size={20} color={colors.darkGrey}/>
    </View>
</TouchableOpacity>


function CustomDrawerContent(props) {

    const navigate = (screen: String) => {
        props.navigation.navigate(screen);
        props.navigation.closeDrawer();
    }

    return (
        <DrawerContentScrollView showsVerticalScrollIndicator={false}
                                 style={{height: Dimensions.get("window").height}} {...props}>
            <View style={{justifyContent: 'space-between', flex: 1, flexDirection: 'column'}}>
                <View>
                    <RenderItem title={"Home"} onPress={() => {
                        navigate("Home")
                    }}/>
                </View>
                <View>
                    <RenderItem title={"Cart"} onPress={() => {
                        navigate("Cart")
                    }}/>
                </View>
                <View>
                    <RenderItem title={"Orders"} onPress={() => {
                        navigate("Orders")
                    }}/>
                </View>
                <View>
                    <RenderItem title={"Profile"} onPress={() => {
                        navigate("Account");
                    }}/>
                </View>
                <View>
                    <RenderItem title={"Logout"} onPress={() => {
                        LogOut()
                    }}/>
                </View>
            </View>
        </DrawerContentScrollView>
    )
}




