import * as React from 'react';
import {View, StyleSheet, Text} from "react-native";
import texts from "@texts";
import SecondaryHeader from "@headers/SecondaryHeader";
import {BorderButtonBigBlue} from "@Buttons";
import commonStyles from "@commonStyles";
import * as Linking from "expo-linking";

export default function UpdateAppScreen(props: any) {

    const goToPlayStore = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.simplyfi.neopay')
    }

    return (
        <View style={{flex: 1, paddingHorizontal: 24}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[texts.greyTextBold14, {marginBottom:20}]}>
                    Please update the app to proceed further.
                </Text>
                <View style={commonStyles.row}>
                    <BorderButtonBigBlue text={"Update App"} ctaFunction={goToPlayStore}/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})
