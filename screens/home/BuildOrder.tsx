import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import colors from "../../assets/colors/colors";
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import Indicator from "../../utils/Indicator";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import {SolidButtonBlue} from "../../buttons/Buttons";
import {connect, useSelector} from 'react-redux';
import mapStateToProps from "../../store/mapStateToProps";
import {useNavigation, useRoute} from "@react-navigation/native";
import AddProductButton from "./AddProductButton";
import SecondaryHeader from "../../headers/SecondaryHeader";

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

export function BuildOrder(props) {
    let _ = require('underscore');
    const navigation = useNavigation();
    const route = useRoute();
    const [productsData, setProductsData] = useState([]);
    const [originalProductsData, setOriginalProductsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [productCount, setProductCount] = useState(props.productCount);
    const distributor = useSelector((state: any) => state.distributor);

    useEffect(() => {
        if(route.params){
            setProductsData(route.params.productData);
            setOriginalProductsData(route.params.productData);
        }
    }, [])

    const selectProduct = (data, type, mainIndex, subIndex) => {
        let allProducts = [...productsData];
        if (type === "new") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = 1;
            setProductCount(prevCount => prevCount + 1);
        } else if (type == "add") {
            setProductCount(prevCount => prevCount + 1);
            allProducts[mainIndex]["data"][subIndex]["quantity"] = data.quantity ? parseInt(allProducts[mainIndex]["data"][subIndex]["quantity"]) + 1 : 1;
        } else if (type == "subtract") {
            setProductCount(prevCount => prevCount - 1);
            if (allProducts[mainIndex]["data"][subIndex]["quantity"] > 1) {
                allProducts[mainIndex]["data"][subIndex]["quantity"] = parseInt(allProducts[mainIndex]["data"][subIndex]["quantity"]) - 1;
            } else {
                allProducts[mainIndex]["data"][subIndex]["quantity"] = 0;
            }
        }
        setProductsData(allProducts);
    }

    const getProducts = () => {
        let productsToSend = originalProductsData;
        let products: any = {};
        let available = false;

        productsToSend.forEach((product) => {
            product.data.forEach((item) => {
                if (parseInt(item.quantity) > 0) {
                    products[item.id] = item.quantity;
                    available = true;
                }
            })
        })
        return {products, available};
    }


    const placeOrder = () => {
        const type = props.comingFrom;
        const method = type === "edit" ? commonApi.editOrder.method : commonApi.placeOrder.method;
        let url = type === "edit" ? commonApi.editOrder.url + props.existingOrderData.id + "/" : commonApi.placeOrder.url;
        const header = type === "edit" ? commonApi.editOrder.header : commonApi.placeOrder.header
        let {products} = getProducts();
        setIsLoading(true);
        let current = {
            retailer: props.retailerData.id,
            distributor: distributorId,
            retailer_id: props.retailerData.id,
            edit_type: "salesman_edit"
        }
        if (type == "edit") {
            current["product_list"] = JSON.stringify(products)
        } else {
            current["products"] = JSON.stringify(products)
        }
        const dataToSend = {
            method: method,
            url: url,
            header: header,
            data: current
        }
        AuthenticatedPostRequest(dataToSend).then((res) => {
            setIsLoading(false);
            if (res.status == 200 || res.status == 201) {
                navigation.replace('order-placed', {orderData: res.data, retailerData: props.data})
            }
        })
    }

    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let allProducts = [...productsData];
        let selected_value = allProducts[mainIndex]["data"][subIndex]["quantity"];
        let current = selected_value != "" ? selected_value : 0;
        if (text !== "") {
            setProductCount(prevCount => prevCount + parseInt(text) - parseInt(current));
        } else {
            setProductCount(prevCount => prevCount - parseInt(current));
        }
        allProducts[mainIndex]["data"][subIndex]["quantity"] = text;
        setProductsData(allProducts);
    }

    const expandImage = (mainIndex, subIndex) => {
        let allProducts = [...productsData];
        allProducts[mainIndex]["data"][subIndex]["image_expanded"] = !allProducts[mainIndex]["data"][subIndex]["image_expanded"];
        setProductsData(allProducts);
    }

    const expandProductGroupImage = (mainIndex) => {
        let allProducts = [...productsData];
        allProducts[mainIndex]["pg_image_expanded"] = !allProducts[mainIndex]["pg_image_expanded"];
        setProductsData(allProducts);
    }

    const renderItem = ({item, index}) => {
        return (
            <View>
                <View style={styles.underline}>
                    {item.product_group_id ? <Text style={texts.darkGreyTextBold14}>
                        {item.company_name}
                    </Text> : <Text style={texts.darkGreyTextBold14}>Others</Text>}
                </View>
                {item.product_group_id ? <TouchableOpacity onPress={() => {
                    expandProductGroupImage(index)
                }} style={[commonStyles.rowAlignCenter, {paddingVertical: 10}]}>
                    {!item.pg_image_expanded ? <View style={{marginRight: 10}}>
                        <Image style={styles.productImage}
                               source={item.image ? {uri: item.image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                    </View> : null}
                    <View>
                        <Text style={[texts.greyNormal14, {paddingBottom: 5}]}>
                            {item.company_name} {">"} {item.brand_name}
                        </Text>
                        <Text style={texts.redTextBold14}>
                            {item.product_group}
                        </Text>
                    </View>
                </TouchableOpacity> : null}
                {item.pg_image_expanded ? <TouchableOpacity onPress={() => {
                    expandProductGroupImage(index)
                }}>
                    <Image style={{width: '100%', height: 200, borderRadius: 5}}
                           source={item.image ? {uri: item.image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                </TouchableOpacity> : null}
                {item.data.map((item, subIndex) => {
                    let margin = ((item.mrp - item.rate) / item.rate) * 100
                    return (<View key={item.id + subIndex + '' + item.name} style={styles.underline}>
                        {item.image_expanded ? <TouchableOpacity onPress={() => {
                            expandImage(index, subIndex)
                        }}>
                            <Image style={{width: '100%', height: 200, borderRadius: 5}}
                                   source={item.sku_image ? {uri: item.sku_image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                        </TouchableOpacity> : null}
                        <View style={commonStyles.rowSpaceBetween}>
                            <View style={{width: '70%'}}>
                                <View>
                                    <Text style={[texts.greyNormal12, {paddingTop: 5}]}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 4}]}>
                                    <Text style={texts.darkGreyTextBold14}>
                                        {item.product_group_id ? item.variant : item.name}
                                    </Text>
                                    {item.product_group_id ? <Text style={texts.redTextBold14}>
                                        {" > " + item.sku}
                                    </Text> : null}
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
                                    <View>
                                        {margin > 0 ? <View style={commonStyles.rowAlignCenter}>
                                            <Text style={texts.greyTextBold12}>
                                                Margin:
                                            </Text>
                                            <Text style={texts.greenBold12}>
                                                {" " + margin.toFixed(1) + '%'}
                                            </Text>
                                        </View> : null}
                                    </View>
                                </View>
                            </View>
                            <View style={{width: '30%', flexDirection: "column", alignItems: "flex-end"}}>
                                {!item.image_expanded ? <TouchableOpacity onPress={() => {
                                    expandImage(index, subIndex)
                                }}>
                                    {item.sku_image ? <Image style={{width: 50, height: 50}}
                                                             resizeMode={"contain"}
                                                             source={{uri: item.sku_image}}/> : null}
                                </TouchableOpacity> : null}
                                <View>
                                    <AddProductButton
                                        item={item}
                                        mainIndex={index}
                                        subIndex={subIndex}
                                        setProductQuantity={setProductQuantity}
                                        selectProduct={selectProduct}
                                    />
                                </View>

                            </View>
                        </View>
                    </View>)
                })}
            </View>
        )
    }


    return (
        <View style={{flex: 1, paddingHorizontal:24}}>
            <Indicator isLoading={isLoading}/>
            <SecondaryHeader title={"Create Order"} />
            <View style={styles.container}>
                <View style={[styles.productHeader, commonStyles.rowSpaceBetween]}>
                    <Text style={texts.blueBoldl14}>
                        Add Products
                    </Text>
                    <Text style={texts.blueBoldl14}>
                        Quantity
                    </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                    <FlatList
                        data={productsData}
                        ItemSeparatorComponent={() => <View style={{height: 20}}></View>}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => item.product_group_id + "" + item.product_group_name}
                        renderItem={renderItem}
                        ListFooterComponent={() => <View style={{paddingBottom: 50}}></View>}
                    />
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 20
    },
    card: {
        marginTop: 20,
        marginBottom: 16,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 5,
        borderColor: colors.grey,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        elevation: 2
    },
    callIconDiv: {
        width: 30,
        height: 30,
        borderRadius: 5,
        borderColor: colors.red,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    callIcon: {
        width: 15,
        height: 15
    },
    productHeader: {
        paddingTop: 20,
        paddingBottom: 10
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
});

export default connect(mapStateToProps, {})(BuildOrder);
