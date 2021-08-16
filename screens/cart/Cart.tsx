import React, {Component, useEffect, useState} from 'react';
import {View, StyleSheet, Text, FlatList, Image} from "react-native";
import texts from "../../styles/texts";
import PrimaryHeader from "../../headers/PrimaryHeader";
import {useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../../styles/commonStyles';
import {SolidButtonBlue} from '../../buttons/Buttons';
import colors from "../../assets/colors/colors";
import {connect, useSelector} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {addToCart, cartChangeQuantity, clearCart, updateCartAdd, updateCartSubtract} from "../../actions/actions";
import AddProductButton from "../order/AddProductButton";
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";

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

function Cart(props: any) {
    let _ = require('underscore')
    const navigation = useNavigation();
    const route = useRoute();
    const cart = useSelector((state: any) => state.cart);
    const [groupedData, setGroupedData] = useState([]);

    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let item = {distributorId: cart.distributorId, product: data, text: text};
        let allProducts = [...cart.data];
        allProducts[mainIndex]["data"][subIndex]["quantity"] = text;
        props.cartChangeQuantity(item)
    }

    const selectProduct = (data, type, mainIndex, subIndex) => {
        let item = {distributorId: cart.distributorId, product: {...data}};
        if (type === "new") {
            props.addToCart(item);
        } else if (type == "add") {
            props.updateCartAdd(item);
        } else if (type == "subtract") {
            props.updateCartSubtract(item);
        }
    }

    const getProducts = () => {
        let products: any = {};
        cart.data.forEach((itm) => {
            if (parseInt(itm.quantity) > 0) {
                products[itm.id] = parseInt(itm.quantity);
            }
        })
        return products;
    }

    useEffect(()=>{
        let groupedData = _.chain(cart.data)
            .groupBy("product_group")
            .map((value, key) => ({
                company_name: value[0]["company_name"],
                brand_name: value[0]["brand_name"],
                image: value[0]["product_group_image"],
                product_group: key,
                image_expanded: false,
                product_group_id: value[0]["product_group_id"],
                data: value
            })).value()
        setGroupedData(groupedData)
    }, [])

    const placeOrder = () => {
        let products = getProducts();
        const dataToSend = {
            method: commonApi.placeOrder.method,
            url: commonApi.placeOrder.url,
            header: commonApi.placeOrder.header,
            data: {
                products: JSON.stringify(products),
                distributor: route.params.distributorId,
                retailer: 534
            }
        }
        AuthenticatedPostRequest(dataToSend).then((res) => {
            if (res.status == 201) {
                props.clearCart();
                navigation.goBack()
            }
        })
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
                    return (<View key={index + "" + subIndex} style={styles.underline}>
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
        cart.data.length > 0 ? <View style={{flex: 1, backgroundColor: colors.white}}>
            <PrimaryHeader navigation={props.navigation}/>
            <View style={{paddingHorizontal: 24, paddingTop: 20}}>
                <FlatList
                    data={groupedData}
                    ItemSeparatorComponent={() => <View style={{height: 20}}></View>}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item.product_group_id + "" + index}
                    renderItem={renderItem}
                    ListFooterComponent={() => <View style={{paddingBottom: 12}}></View>}
                />
                <View style={styles.underline}>
                    <View style={commonStyles.rowSpaceBetween}>
                        <Text style={texts.redTextBold14}>
                            Total Items:
                        </Text>
                        <Text style={texts.darkGreyTextBold14}>
                            {cart.count}
                        </Text>
                    </View>
                    <View style={commonStyles.rowSpaceBetween}>
                        <Text style={texts.redTextBold14}>
                            Item Total:
                        </Text>
                        <Text style={texts.darkGreyTextBold14}>
                            {parseFloat(cart.value).toFixed(2)}
                        </Text>
                    </View>
                    <View style={commonStyles.rowSpaceBetween}>
                        <Text style={texts.redTextBold14}>
                            Discount:
                        </Text>
                        <Text style={texts.darkGreyTextBold14}>
                            {0}
                        </Text>
                    </View>
                    <View style={commonStyles.rowSpaceBetween}>
                        <Text style={texts.redTextBold14}>
                            Net Payable:
                        </Text>
                        <Text style={texts.darkGreyTextBold14}>
                            {parseFloat(cart.value).toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={[commonStyles.row, {position: "absolute", bottom: 10, marginHorizontal: 24}]}>
                <SolidButtonBlue ctaFunction={placeOrder} text={"Place Order"}/>
            </View>
        </View> : <View style={{flex: 1}}>
            <PrimaryHeader navigation={props.navigation}/>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={texts.greyTextBold18}>
                    No items in your cart
                </Text>
            </View>
        </View>
    );
}

export default connect(
    mapStateToProps,
    {addToCart, updateCartAdd, updateCartSubtract, cartChangeQuantity, clearCart}
)(Cart);

const styles = StyleSheet.create({
    cardImage: {
        height: 40,
        width: 80,
        backgroundColor: colors.light_grey
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        paddingBottom: 10
    },
    productImage: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 5
    }
})
