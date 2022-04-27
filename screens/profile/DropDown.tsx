import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import texts from "../../styles/texts";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";
import colors from "../../assets/colors/colors";


const DropDown = (props) => {
    return (
        <View>
            <Text style={[texts.redTextBold12, {paddingTop: 20}]}>
                {props.header}
            </Text>
            <TouchableOpacity onPress={props.onPress}>
                <View style={[styles.textInput, styles.dropdown]}>
                    <Text style={texts.greyTextBold14}>
                        {props.property ? props.property.name : props.placeholder}
                    </Text>
                    <View style={styles.editIcon}>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.red}/>
                    </View>
                </View>
                {props.popup ? <props.modal
                    {...props}
                    closeModal={() => {
                        props.toggleModal(false);
                    }}
                    selectItem={(item) => {
                        props.selectItem(item);
                    }}
                /> : null}
            </TouchableOpacity>
        </View>)
}

export default DropDown;

const styles = StyleSheet.create({
    modalContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 24
    },
    closeIconDiv: {
        alignItems: 'flex-end'
    },
    closeIcon: {
        paddingLeft: 10,
        paddingBottom: 10
    },
    container: {
        backgroundColor: colors.white,
        marginVertical: 40,
        borderRadius: 5,
        padding: 12,
        minHeight: Dimensions.get("window").height - 80
    },
    textInput: {
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.grey,
        paddingLeft: 10,
        height: 36
    },
    editIcon: {
        backgroundColor: "#f6ebf0",
        width: 24,
        height: 24,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    }
})