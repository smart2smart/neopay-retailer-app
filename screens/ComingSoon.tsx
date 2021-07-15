import * as React from 'react';
import {View, StyleSheet, Text} from "react-native";
import texts from "../styles/texts";
import PrimaryHeader from "../headers/PrimaryHeader";

export default function ComingSoon(props:any) {
    return (
        <View style={{flex:1}}>
            <PrimaryHeader navigation={props.navigation}/>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text style={texts.blackTextBold18}>
                COMING SOON
            </Text>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({

})
