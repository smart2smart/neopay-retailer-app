import * as React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {AntDesign} from '@expo/vector-icons';
import colors from "../assets/colors/colors";
import {useNavigation} from '@react-navigation/native';

import texts from "../styles/texts";

export default function SecondaryHeader(props: any) {
    const navigation = useNavigation();
    return (
        <View style={style.headerContainer}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity onPress={() => {
                    if (props.manualNavigate) {
                        navigation.navigate(props.manualNavigate);
                    } else {
                        navigation.goBack()
                    }
                }}>
                    <AntDesign name="arrowleft" size={24} color={colors.blue}/>
                </TouchableOpacity>
                <Text style={[texts.darkGreyTextBold16, {marginLeft: 10}]}>
                    {props.title}
                </Text>
            </View>
            <View>
                {props.headerRight ? <View>
                    <TouchableOpacity onPress={props.headerRightCta}>
                        <Text style={texts.redTextBold14}>
                            {props.headerRightTitle}
                        </Text>
                    </TouchableOpacity>
                </View> : null}
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 16,
        width:"100%",
        justifyContent: "space-between",
    },
})
