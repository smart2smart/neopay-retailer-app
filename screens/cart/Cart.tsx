// import * as React from 'react';
import React, {Component, useEffect, useState} from 'react';
import {View, StyleSheet, Text,FlatList, Image} from "react-native";
import texts from "../../styles/texts";
import PrimaryHeader from "../../headers/PrimaryHeader";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../../styles/commonStyles';
import { BorderButtonBigRed } from '../../buttons/Buttons';
import colors from "../../assets/colors/colors";
import {connect, useSelector} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {addToCart, cartChangeQuantity, updateCartAdd, updateCartSubtract} from "../../actions/actions";
import AddProductButton from "../order/AddProductButton";

const sku_units = {
    1: 'kg',
    2: 'g',
    3: 'ml',
    4: 'ltr',
    5: 'pcs',
    6: 'strip',
    7: 'pack',
    8: 'tablet',
    9: 'box',
    10: 'bag'
}

function Cart(props:any) {
    const navigation = useNavigation();
    const route = useRoute();
    const cart = useSelector((state: any) => state.cart.data);

    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let item = {distributorId: route.params.distributorId, product: data, text:text};
        let allProducts = [...cart];
        allProducts[mainIndex]["data"][subIndex]["quantity"] = text;
        props.cartChangeQuantity(item)
    }

    const selectProduct = (data, type, mainIndex, subIndex) => {
        let item = {distributorId: route.params.distributorId, product: data};
        let allProducts = [...cart];
        if (type === "new") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = 1;
            props.addToCart(item);
        } else if (type == "add") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = parseInt(allProducts[mainIndex]["data"][subIndex]["quantity"])+1;
            props.updateCartAdd(item);
        } else if (type == "subtract") {
            if (allProducts[mainIndex]["data"][subIndex]["quantity"] > 0) {
                allProducts[mainIndex]["data"][subIndex]["quantity"] = parseInt(allProducts[mainIndex]["data"][subIndex]["quantity"])-1 ;
            }
            props.updateCartSubtract(item);
        }
    }


    const renderItem = ({item, index}) => {
        return (
            <View>
                <View style={styles.underline}>
                    <Text style={texts.darkGreyTextBold14}>
                        {item.company_name}
                    </Text>
                </View>
                <View style={[commonStyles.rowAlignCenter, {paddingTop: 10}]}>
                    <View>
                        <Image style={styles.productImage}
                               source={item.image ? {uri: item.image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                    </View>
                    <View style={{paddingLeft: 10}}>
                        <Text style={[texts.greyNormal14, {paddingBottom: 8}]}>
                            {item.company_name} {">"} {item.brand_name}
                        </Text>
                        <Text style={texts.redTextBold14}>
                            {item.product_group}
                        </Text>
                    </View>
                </View>
                {item.data.map((item, subIndex) => {
                    return (<View style={styles.underline}>
                        <View style={commonStyles.rowSpaceBetween}>
                            <View style={{width: '70%'}}>
                                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 5}]}>
                                    <Text style={texts.darkGreyTextBold14}>
                                        {item.name}
                                    </Text>
                                    <Text style={texts.redTextBold14}>
                                        {" " + item.sku_quantity}{sku_units[item.sku_unit]}
                                    </Text>
                                </View>
                                <View style={commonStyles.rowSpaceBetween}>
                                    <View style={commonStyles.row}>
                                        <Text style={texts.greyTextBold12}>
                                            MRP:
                                        </Text>
                                        <Text style={texts.greyTextBold12}>
                                            {" " + item.mrp}
                                        </Text>
                                    </View>
                                    <View style={commonStyles.row}>
                                        <Text style={texts.greyTextBold12}>
                                            Rate:
                                        </Text>
                                        <Text style={texts.greyTextBold12}>
                                            {" " + item.rate}
                                        </Text>
                                    </View>
                                    <View style={commonStyles.rowAlignCenter}>
                                        <Text style={texts.greyTextBold12}>
                                            Margin:
                                        </Text>
                                        <Text style={texts.greenBold12}>
                                            {" " + (((item.mrp - item.rate) / item.rate) * 100).toFixed(1)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width: '30%', justifyContent: "flex-end", flexDirection: "row"}}>
                                <AddProductButton
                                    item={item}
                                    mainIndex={index}
                                    subIndex={subIndex}
                                    setProductQuantity={setProductQuantity}
                                    selectProduct={selectProduct}
                                />
                            </View>
                        </View>
                    </View>)
                })}
            </View>
        )
    }

    return (
        <View style={{flex:1}}>
            <PrimaryHeader navigation={props.navigation}/>
            <FlatList
                data={cart}
                ItemSeparatorComponent={() => <View style={{height: 20}}></View>}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item.product_group_id + "" + index}
                renderItem={renderItem}
                ListFooterComponent={() => <View style={{paddingBottom: 50}}></View>}
            />
        </View>
    );
}

export default connect(
    mapStateToProps,
    {addToCart, updateCartAdd, updateCartSubtract, cartChangeQuantity}
)(Cart);

const styles = StyleSheet.create({
    cardImage: {
        height: 40,
        width: 80,
        backgroundColor: colors.light_grey
    },
})
