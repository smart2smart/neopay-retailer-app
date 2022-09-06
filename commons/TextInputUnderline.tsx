import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Dimensions, TouchableOpacity, Image, Alert} from 'react-native';
import texts from "@texts";


export default function TextInputUnderline(props:any) {

    return (
        <View style={style.textInputDiv}>
            {props.property ? <Text style={texts.redTextBold14}>{props.placeholder}</Text> : null}
            <TextInput
                editable={props.editable}
                value={props.property}
                placeholder={props.placeholder}
                onChangeText={(text) => props.onChange(text)}
                style={style.textInput}>
            </TextInput>
        </View>
    )
}

const style = StyleSheet.create({
    textInputDiv: {
        paddingBottom: 30
    },
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        fontFamily: "GothamMedium",
        fontSize: 14,
        borderWidth: 0,
        borderColor: 'transparent',
        width: '100%',
        height: 40,
        padding: 0,
    },
})
