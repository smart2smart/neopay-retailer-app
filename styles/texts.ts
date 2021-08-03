import {StyleSheet, Platform, StatusBar, Dimensions} from "react-native";
import colors from "../assets/colors/colors";

const texts = StyleSheet.create({
    blueHeading1: {
        color: colors.primaryThemeColor,
        fontSize: 18,
        fontFamily: "GothamMedium",
        fontWeight: 'bold',
        letterSpacing: 1.3
    },
    primaryTextBold16: {
        color: colors.primary_color,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    greyNormal12: {
        fontSize: 12,
        fontFamily: "GothamBook",
        color: colors.grey,
        lineHeight:20
    },
    greyNormal10: {
        fontSize: 10,
        fontFamily: "GothamBook",
        color: colors.grey,
        lineHeight:20
    },
    greyNormal14: {
        fontSize: 14,
        fontFamily: "GothamBook",
        color: colors.grey,
        lineHeight:20
    },
    darkGreyNormal12: {
        fontSize: 12,
        fontFamily: "GothamBook",
        color: colors.darkGrey
    },
    darkGreyNormal14: {
        fontSize: 14,
        fontFamily: "GothamBook",
        color: colors.darkGrey
    },
    primaryTextBold12: {
        color: colors.primary_color,
        fontFamily: "GothamMedium",
        fontSize: 12
    },
    primaryThemeTextBold12: {
        color: colors.primaryThemeColor,
        fontFamily: "GothamMedium",
        fontSize: 14
    },
    redTextNormal10: {
        color: colors.red,
        fontFamily: "GothamMedium",
        fontSize: 10
    },
    redTextBold12: {
        color: colors.red,
        fontFamily: "GothamMedium",
        fontSize: 12
    },
    redTextBold15: {
        color: colors.red,
        fontFamily: "GothamMedium",
        fontSize: 15
    },
    primaryTextBold14: {
        color: colors.primary_color,
        fontFamily: "GothamMedium",
        fontSize: 14,
        lineHeight:20
    },
    primaryTextBold15: {
        color: colors.primary_color,
        fontFamily: "GothamMedium",
        fontSize: 15
    },
    greyTextBold14: {
        color: colors.grey,
        fontFamily: "GothamMedium",
        fontSize: 14,
        lineHeight:20
    },
    greyTextBold13: {
        color: colors.grey,
        fontFamily: "GothamMedium",
        fontSize: 13,
        lineHeight:20
    },
    greyTextBold12: {
        color: colors.grey,
        fontFamily: "GothamMedium",
        fontSize: 12,
        lineHeight:20
    },
    redTextBold14: {
        color: colors.red,
        fontFamily: "GothamMedium",
        fontSize: 14
    },
    redTextBold16: {
        color: colors.red,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    redTextBold20: {
        color: colors.light_red,
        fontFamily: "GothamMedium",
        fontSize: 20
    },
    orangeTextBold12: {
        color: colors.orange,
        fontFamily: "GothamMedium",
        fontSize: 12
    },
    orangeTextBold14: {
        color: colors.orange,
        fontFamily: "GothamMedium",
        fontSize: 14
    },
    blackTextBold14: {
        color: colors.black,
        fontFamily: "GothamMedium",
        fontSize: 14
    },
    blackTextBold18: {
        color: colors.black,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    darkGreyTextBold14: {
        color: colors.darkGrey,
        fontFamily: "GothamMedium",
        fontSize: 14,
        lineHeight:20
    },
    darkGreyTextBold12: {
        color: colors.darkGrey,
        fontFamily: "GothamMedium",
        fontSize: 12,
        lineHeight:20
    },
    darkGreyTextBold16: {
        color: colors.darkGrey,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    greyTextBold15: {
        color: colors.grey,
        fontFamily: "GothamMedium",
        fontSize: 15
    },
    greyTextBold16: {
        color: colors.grey,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    blackTextBold16: {
        color: colors.black,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    greyTextBold18: {
        color: colors.grey,
        fontFamily: "GothamMedium",
        fontSize: 18
    },
    whiteNormal14: {
        fontSize: 14,
        fontFamily: "GothamBook",
        color: colors.white
    },
    whiteNormal12: {
        fontSize: 10,
        fontFamily: "GothamBook",
        color: colors.white
    },
    blueNormal15: {
        fontSize: 15,
        fontFamily: "GothamBook",
        color: colors.blue
    },
    blueBoldl14: {
        fontSize: 14,
        fontFamily: "GothamMedium",
        color: colors.blue
    },
    blueBold12: {
        fontSize: 12,
        fontFamily: "GothamMedium",
        color: colors.blue
    },
    whiteTextBold12: {
        color: colors.white,
        fontFamily: "GothamMedium",
        fontSize: 12
    },
    whiteTextBold14: {
        color: colors.white,
        fontFamily: "GothamMedium",
        fontSize: 14,
    },
    whiteTextBold16: {
        color: colors.white,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    darkGrey18Bold: {
        color: colors.darkGrey,
        fontFamily: "GothamMedium",
        fontSize: 18
    },
    whiteBold20: {
        fontFamily: "GothamMedium",
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 2,
        color: colors.white
    },
    statusText: {
        color: colors.white,
        fontFamily: "GothamMedium",
        fontSize: 10
    },
    greenNormal13: {
        color: colors.green,
        fontFamily: "GothamMedium",
        fontSize: 13
    },
    greenNormal15: {
        color: colors.green,
        fontFamily: "GothamMedium",
        fontSize: 15
    },
    greenTextBold16: {
        color: colors.green,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    lightRedNormal16: {
        color: colors.light_red,
        fontFamily: "GothamMedium",
        fontSize: 16
    },
    lightRedBold24: {
        color: colors.light_red,
        fontFamily: "GothamMedium",
        fontSize: 24
    },
    lightRedBold37: {
        color: colors.light_red,
        fontFamily: "GothamMedium",
        fontSize: 37
    },
})

export default texts;