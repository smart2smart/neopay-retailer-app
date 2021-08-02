import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import commonStyles from "../styles/commonStyles";
import colors from "../assets/colors/colors";
import texts from "../styles/texts";
import Icon from "react-native-vector-icons/Feather";
import React from "react";
import {connect, useSelector} from "react-redux";
import mapStateToProps from "../store/mapStateToProps";
import {addToCart, updateCartAdd, updateCartSubtract} from "../actions/actions";
import {useNavigation} from "@react-navigation/native";


function CartButton() {


    const navigation = useNavigation();
    const cart = useSelector((state: any) => state.cart);

    const openCart = () => {
        navigation.navigate("ReviewCart", {})
    }



    return (<TouchableOpacity onPress={() => {
        openCart()
    }} style={styles.footer}>
        <View style={[commonStyles.rowSpaceBetween, {paddingHorizontal: 24}]}>
            <View style={commonStyles.row}>
                <View style={{borderRightWidth: 1, borderRightColor: colors.white, paddingHorizontal: 10}}>
                    <Text style={texts.whiteNormal14}>{cart.count}</Text>
                </View>
                <View style={{paddingHorizontal: 10}}>
                    <Text style={texts.whiteNormal14}>{0}</Text>
                </View>
            </View>
            <View style={[commonStyles.row, {marginLeft: 40}]}>
                <View>
                    <Text style={texts.whiteNormal14}>Order Value: </Text>
                </View>
                <View>
                    <Text style={texts.whiteNormal14}>{0}</Text>
                </View>
                <View style={{marginLeft: 10}}>
                    <Icon name="chevron-right" size={14} color={colors.white}/>
                </View>
            </View>
        </View>
    </TouchableOpacity>)
}

export default connect(
    mapStateToProps,
    { addToCart, updateCartAdd, updateCartSubtract }
)(CartButton);

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.blue,
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    }
})