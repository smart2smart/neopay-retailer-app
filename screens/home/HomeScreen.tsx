import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import mapStateToProps from "../../store/mapStateToProps";
import {setIsLoggedIn} from "../../actions/actions";
// @ts-ignore
import {connect, useSelector} from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import { BorderButtonBigRed } from '../../buttons/Buttons';
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";

export function HomeScreen(props: any) {

    const navigation = useNavigation();

    const createOrder = () => {
        navigation.navigate("CreateOrder")
    };

    const storeDetails = () => {
        navigation.navigate("RetailerDetails")
    };

    return (
        <View style={{flex: 1}}>
            <PrimaryHeader navigation={props.navigation}/>
            <Text>
                Home Screen
            </Text>
            <BorderButtonBigRed text={'Create Order'} ctaFunction={() => createOrder()}/>
            <BorderButtonBigRed text={'Temprary Store details'} ctaFunction={() => storeDetails()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 200,
        backgroundColor: colors.primary_color
    },
    statsCard: {
        backgroundColor: colors.white,
        height: 170,
        elevation: 5,
        borderRadius: 5,
        width: Dimensions.get("window").width - 48,
        position: "absolute",
        top: 124,
        left: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "space-between"
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey,
        paddingBottom: 16
    }
});

export default connect(mapStateToProps, {setIsLoggedIn})(HomeScreen);
