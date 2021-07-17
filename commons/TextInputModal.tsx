import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Dimensions, TouchableOpacity, Image, Alert} from 'react-native';
import texts from "../styles/texts";
import colors from "../assets/colors/colors";
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function TextInputModal(props: any) {
    return (
        <View style={style.textInputDiv}>
            {props.property ? <Text style={texts.redTextBold14}>{props.title}</Text> : null}
            <TouchableOpacity onPress={() => {
                props.toggleModal(true);
            }} style={style.borderBottom}>
                <Text style={texts.greyTextBold14}>
                    {!props.property ? props.title : props.property.name}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color={colors.red}/>
            </TouchableOpacity>
            <props.modal
                modalVisible={props.modalVisible}
                data={props.data}
                type={""}
                closeModal={() => {
                    props.toggleModal(false);
                }}
                selectItem={(item) => {
                    props.toggleModal(false);
                    props.selectItem(item);
                }}/>
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
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        height: 40,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})
