import * as React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import {Entypo, Ionicons} from '@expo/vector-icons';
import colors from "../assets/colors/colors";
import { DrawerActions } from '@react-navigation/native';
import commonStyles from "../styles/commonStyles";
import texts from "../styles/texts";

export default function PrimaryHeader(props:any) {
    return (
        <View style={[styles.header, commonStyles.rowSpaceBetween]}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={()=>{props.navigation.dispatch(DrawerActions.openDrawer());}}>
                    <Entypo name="menu" size={34} color="white"/>
                </TouchableOpacity>
                <Image resizeMode={"contain"} style={styles.logo} source={require('../assets/images/neopay_white_logo.png')}/>
                <Text style={[texts.whiteBold20,{marginLeft:10}]}>
                    NEO PAY
                </Text>
            </View>
            <Ionicons name="notifications-outline" size={26} color={colors.white}/>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        backgroundColor:colors.primaryThemeColor,
        height:56
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        height: 30,
        width: 30,
        marginLeft: 15
    },
})