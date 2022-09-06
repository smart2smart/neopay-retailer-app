import {Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import colors from "@colors";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ToggleView(props) {
    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    props.selectTab("list")
                }} style={[styles.listDiv, styles.borderRight]}>
                    {props.selectedTab=="list"?<Ionicons name="ios-menu-sharp" size={22} color={colors.red}/>:
                        <Ionicons name="ios-menu-sharp" size={22} color={colors.grey}/>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    props.selectTab("tab")
                }} style={styles.listDiv}>
                    {props.selectedTab=="tab"?<MaterialCommunityIcons name="table" size={22} color={colors.red}/>:
                        <MaterialCommunityIcons name="table" size={22} color={colors.grey}/>}
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.red,
        borderRadius: 5,
        flexDirection: "row"
    },
    listDiv: {
        padding: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: colors.red
    }
})