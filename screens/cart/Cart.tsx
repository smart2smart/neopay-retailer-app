import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import texts from "../../styles/texts";
import PrimaryHeader from "../../headers/PrimaryHeader";
import {useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../../styles/commonStyles';
import {BorderButtonSmallBlue, SolidButtonBlue} from '../../buttons/Buttons';
import colors from "../../assets/colors/colors";
import {connect, useSelector} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {clearCart, removeFromCart, updateCartAdd, updateCartSubtract, cartChangeQuantity} from "../../actions/actions";
import AddProductButton from "../home/AddProductButton";
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import Indicator from "../../utils/Indicator";

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
    const groupData = (data) => {
        return _.chain(data)
            .groupBy("product_group")
            .map((value, key) => ({
                company_name: value[0]["company_name"],
                brand_name: value[0]["brand_name"],
                image: value[0]["product_group_image"],
                product_group: key,
                image_expanded: false,
                product_group_id: value[0]["product_group_id"],
                data: value,
                pg_image_expanded: false,
                quantity: 0
            })).value();
    }
    let _ = require('underscore')
    const navigation = useNavigation();
    const route = useRoute();
    const cart = useSelector((state: any) => state.cart);
    const groupedData = groupData(cart.data);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const distributor = useSelector((state: any) => state.distributor);
    const retailerData = useSelector((state: any) => state.retailerDetails);


    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let item = {
            distributorId: distributor.user,
            product: {...data},
            text: text,
            originalQuantity: data.quantity == "" ? 0 : parseInt(data.quantity)
        };
        item.product["quantity"] = text;
        props.cartChangeQuantity(item);
    }

    const selectProduct = (data, type, mainIndex, subIndex) => {
        let item = {distributorId: distributor.user, product: {...data}};
        if (type === "new") {
            item.product.quantity = 1;
            props.updateCartAdd(item);
        } else if (type == "add") {
            item.product.quantity += 1;
            props.updateCartAdd(item);
        } else if (type == "subtract") {
            if (item.product.quantity > 1) {
                item.product.quantity -= 1;
                props.updateCartSubtract(item);
            } else {
                item.product.quantity = 0;
                props.removeFromCart(item);
            }
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

    const goToDistributorProducts = () => {
        navigation.navigate("BuildOrder")
    }

    const placeOrder = () => {
        setLoading(true);
        let products = getProducts();
        const dataToSend = {
            method: commonApi.placeOrder.method,
            url: commonApi.placeOrder.url,
            header: commonApi.placeOrder.header,
            data: {
                products: JSON.stringify(products),
                distributor: distributor.user,
                retailer: retailerData.id
            }
        }
        AuthenticatedPostRequest(dataToSend).then((res) => {
            setLoading(false);
            if (res.status == 201) {
                props.clearCart();
                navigation.goBack()
            }
        })
    }

    useEffect(() => {
        getDiscount();
    }, [])

    const getDiscount = () => {
        const data = {
            method: commonApi.getDiscountAmount.method,
            url: commonApi.getDiscountAmount.url + "?distributor_id=" + cart.distributorId + "&amount=" + cart.value,
            header: commonApi.getDiscountAmount.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                setDiscount(res.data.discount_amount);
            }
        });
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
                                        {item.product_group_id ? item.variant : item.name}
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
            <Indicator isLoading={loading}/>
            <View style={{paddingHorizontal: 24, paddingTop: 20, flex: 1}}>
                <FlatList
                    data={groupedData}
                    ItemSeparatorComponent={() => <View style={{height: 20}}></View>}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item.product_group_id + "" + index}
                    renderItem={renderItem}
                    ListFooterComponent={() => <View style={{paddingBottom: 100, paddingTop: 10}}>
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
                            {discount !== 0 ? <View style={commonStyles.rowSpaceBetween}>
                                <Text style={texts.redTextBold14}>
                                    Discount:
                                </Text>
                                <Text style={texts.darkGreyTextBold14}>
                                    {0}
                                </Text>
                            </View> : null}
                            <View style={commonStyles.rowSpaceBetween}>
                                <Text style={texts.redTextBold14}>
                                    Net Payable:
                                </Text>
                                <Text style={texts.darkGreyTextBold14}>
                                    {parseFloat(cart.value - discount).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        <View style={{marginTop: 16}}>
                            <BorderButtonSmallBlue ctaFunction={goToDistributorProducts} text={"Add more items"}/>
                        </View>
                    </View>}
                />
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
    {removeFromCart, updateCartAdd, updateCartSubtract, clearCart, cartChangeQuantity}
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
