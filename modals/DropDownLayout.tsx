import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import texts from "@texts";
import colors from "@colors";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const DropDownLayout = (props) => {
    return (<TouchableOpacity onPress={props.onPress}>
        <View style={[styles.textInput, styles.dropdown]}>
            <Text style={texts.greyTextBold14}>
                {props.property ? props.property.name : props.placeholder}
            </Text>
            <View style={styles.editIcon}>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.red}/>
            </View>
        </View>
    </TouchableOpacity>)
}

const styles = StyleSheet.create({
    textInput: {
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.grey,
        paddingLeft: 10,
        height: 36
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    },
    editIcon: {
        backgroundColor: "#f6ebf0",
        width: 24,
        height: 24,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
})