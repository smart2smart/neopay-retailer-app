import {Dimensions, Image, StyleSheet, TouchableOpacity, Text} from "react-native";
import React from "react";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";


const RenderCompanyCard = ({item, index}, props) => {
    let padding = (Dimensions.get("window").width - 48) * 0.1 / 2;
    return (
        <TouchableOpacity onPress={() => {
            props.selectFunction(item.type, item)
        }} style={[styles.companyCard, (index + 1) % 3 !== 0 ? {marginRight: padding} : {}]}>
            <Image style={{width: "84%", height: "84%"}} resizeMode={"contain"} source={item.image?{uri:item.image}:
            require("../../assets/images/camera.png")}/>
            <Text style={[texts.darkGreyTextBold12, {marginBottom:4}]}>
                {item.name?item.name.slice(0,12):""}
            </Text>
        </TouchableOpacity>
    )
}

export default RenderCompanyCard;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        position: 'relative',
        flex: 1,
        backgroundColor: colors.white
    },
    companyCard: {
        height: 120,
        width: "30%",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.light_grey,
        justifyContent: "center",
        alignItems: "center",
    },
})