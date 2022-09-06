import {Dimensions, StyleSheet, Text, TextInput, View} from "react-native";
import texts from "@texts";
import React from "react";
import colors from "@colors";

export default function InputBox(props) {
    return (
        <View>
            <Text style={[texts.redTextBold12, {paddingTop: 20}]}>
                {props.title}
            </Text>
            <TextInput
                value={props.value}
                placeholder={props.placeholder}
                onChangeText={(text) => props.setter(text)}
                style={[styles.textInput, texts.greyTextBold14]}>
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.grey,
        paddingLeft: 10,
        height: 36
    }
})