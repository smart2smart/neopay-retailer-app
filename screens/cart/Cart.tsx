import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, StyleSheet, Text, View} from "react-native";
import texts from "../../styles/texts";
import PrimaryHeader from "../../headers/PrimaryHeader";
import {useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../../styles/commonStyles';
import {BorderButtonSmallBlue, SolidButtonBlue} from '../../buttons/Buttons';
import colors from "../../assets/colors/colors";
import {connect, useDispatch, useSelector} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {
    clearCart,
    removeFromCart,
    updateCartAdd,
    updateCartSubtract,
    cartChangeQuantity,
    changeLotSize
} from "../../actions/actions";
import AddProductButton from "../home/AddProductButton";
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import Indicator from "../../utils/Indicator";
import {RenderItem} from "../home/ProductCard";
import QPSModal from "../../commons/QPSMOdal";
import PersistenceStore from "../../utils/PersistenceStore";

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
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);
    const [count, setCount] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);

    const cart = useSelector((state: any) => state.cart);
    const [productsData, setProductsData] = useState([]);
    const [originalProductsData, setOriginalProductsData] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [qpsData, setQPSData] = useState({});
    const [qpsDiscount, setQPSDiscount] = useState(0);


    const distributor = useSelector((state: any) => state.distributor);
    const retailerData = useSelector((state: any) => state.retailerDetails);
    const [qpsModalVisible, setQPSModalVisible] = useState(false);


    const goToDistributorProducts = () => {
        navigation.navigate("BuildOrder")
    }


    const calculateValues = (data) => {
        let cartData: any = [];
        let products: any = {};
        let total = 0;
        let items = 0
        data.filter((product) => {
            product.data.forEach((item) => {
                if (parseInt(item.quantity) > 0) {
                    products[item.id] = {quantity: parseInt(item.quantity), unit_id: item.selected_unit};
                    total += item.selected_unit != 0 ? parseInt(item.quantity) * parseFloat(item.rate) * item.lot_quantity : parseInt(item.quantity) * parseFloat(item.rate);
                    cartData.push(item);
                    items += parseInt(item.quantity);
                }
            })
        })
        setCount(items);
        setAmount(total);
        getDiscount(total, products);
    }

    useEffect(() => {
        let data = Object.values(cart.data);
        let groupedData = _.chain(data).groupBy("product_group_id")
        groupedData = groupedData.map((value, key) => ({
            company_name: value[0]["company_name"],
            company_id: value[0]["company_id"],
            brand_id: value[0]["brand_id"],
            brand_name: value[0]["brand_name"],
            image: value[0]["product_group_image"],
            product_group_name: value[0]["product_group"],
            collapsed: false,
            image_expanded: false,
            product_group_id: value[0]["product_group_id"],
            data: value,
            pg_image_expanded: false,
        })).value()
        groupedData = _.sortBy(groupedData, function (item) {
            return item.company_name;
        })
        setProductsData(groupedData);
        setOriginalProductsData(groupedData);
        calculateValues(groupedData);
    }, [route])

    const getProducts = () => {
        let productsToSend = originalProductsData;
        let products: any = {};
        let available = false;

        productsToSend.forEach((product) => {
            product.data.forEach((item) => {
                if (parseInt(item.quantity) > 0) {
                    products[item.id] = {quantity: item.quantity, unit_id: item.selected_unit};
                    available = true;
                }
            })
        })
        return {products, available};
    }

    const placeOrder = () => {
        setLoading(true);
        let {products} = getProducts();
        const dataToSend = {
            method: commonApi.placeOrder.method,
            url: commonApi.placeOrder.url,
            header: commonApi.placeOrder.header,
            data: {
                products: JSON.stringify(products),
                distributor: distributor.id,
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

    const getDiscount = (total, products) => {
        const data = {
            method: commonApi.getDiscountAmount.method,
            url: commonApi.getDiscountAmount.url + "?distributor_id=" + distributor.id + "&amount=" + total + "&products=" + JSON.stringify(products),
            header: commonApi.getDiscountAmount.header,
        }

        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                setDiscount(res.data.discount_amount);
                setQPSData(res.data.qps_data);
                setQPSDiscount(parseFloat(res.data.qps_discount).toFixed(2));
            }
        });
    }
    const selectUnitDropdown = (mainIndex, subIndex, lotSizeId, lotQuantity, unitLabel) => {
        let payload = {distributorId: distributor.id};
        let allProducts = [...productsData];
        let entity = allProducts[mainIndex]["data"][subIndex];
        let {current_rate} = get_current_rate(entity, entity.quantity, lotQuantity)
        entity["current_rate"] = current_rate
        entity["selected_unit"] = lotSizeId;
        entity["lot_quantity"] = lotQuantity;
        entity["unit_label"] = unitLabel;
        payload["product"] = entity;
        setProductsData(allProducts);
        dispatch(changeLotSize(payload))
    }

    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let payload = {retailerId: retailerData.id, distributorId: distributor.id}
        let allProducts = [...productsData];
        let entity = allProducts[mainIndex]["data"][subIndex];
        entity["quantity"] = text;
        entity["open"] = false;
        entity["selectedDropDownValue"] = text;
        let {current_rate} = get_current_rate(entity, parseInt(text), entity.lot_quantity)
        entity["current_rate"] = current_rate
        payload["product"] = entity
        setProductsData(allProducts);
        dispatch(cartChangeQuantity(payload))
    };

    const get_current_rate = (entity, quantity, lot_quantity) => {
        let min_qty = 0;
        let current_rate = entity.rate;
        let least_rate = entity.rate;
        if (entity.qps.length > 0) {
            entity.qps.forEach((qps) => {
                if (qps.min_qty * lot_quantity >= min_qty) {
                    least_rate = parseFloat(parseFloat(entity.rate) * (1 - qps.discount_rate / 100)).toFixed(2)
                }
                if (quantity * lot_quantity >= qps.min_qty) {
                    current_rate = parseFloat(parseFloat(entity.rate) * (1 - qps.discount_rate / 100)).toFixed(2)
                }
            })
        }
        return {current_rate, least_rate}
    }

    const selectProduct = (data, type, mainIndex, subIndex) => {
        let payload = {retailerId: retailerData.id, distributorId: distributor.id}
        let allProducts = [...productsData];
        let entity = allProducts[mainIndex]["data"][subIndex];
        if (type === "new") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = 1;
            let {current_rate} = get_current_rate(entity, 1, entity["lot_quantity"]);
            entity["current_rate"] = current_rate
            payload["product"] = entity;
            dispatch(updateCartAdd(payload))
        } else if (type == "add") {
            entity["quantity"] = data.quantity ? parseInt(entity["quantity"]) + 1 : 1;
            let {current_rate} = get_current_rate(entity, entity.quantity, entity["lot_quantity"]);
            entity["current_rate"] = current_rate
            payload["product"] = entity;
            dispatch(updateCartAdd(payload))
        } else if (type == "subtract") {
            if (entity["quantity"] > 1) {
                entity["quantity"] = parseInt(entity["quantity"]) - 1;
                let {current_rate} = get_current_rate(entity, entity.quantity, entity["lot_quantity"]);
                entity["current_rate"] = current_rate
                payload["product"] = entity;
                dispatch(updateCartSubtract(payload))
            } else {
                entity["quantity"] = 0;
                let {current_rate} = get_current_rate(entity, 1, entity["lot_quantity"]);
                entity["current_rate"] = current_rate
                payload["product"] = entity;
                dispatch(removeFromCart(payload))
            }
        }
        setProductsData(allProducts);
    };

    const selectProductAlert = (data, type, mainIndex, subIndex) => {
        if (cart.distributorId && cart.distributorId !== distributor.id) {
            Alert.alert(
                "Change Distributor",
                `You have items in your cart from another distributor. Adding new distributor will clear your cart. Are you sure you want to continue?`,
                [
                    {
                        text: "Yes",
                        onPress: () => {
                            props.clearCart();
                            PersistenceStore.removeCart();
                            selectProduct(data, type, mainIndex, subIndex);
                        },
                    },
                    {
                        text: "No",
                        onPress: () => {
                        },
                    },
                ],
                {cancelable: false}
            );
        } else {
            selectProduct(data, type, mainIndex, subIndex);
        }
    };

    const expandImage = (mainIndex, subIndex) => {
        let allProducts = [...productsData];
        allProducts[mainIndex]["data"][subIndex]["image_expanded"] =
            !allProducts[mainIndex]["data"][subIndex]["image_expanded"];
        setProductsData(allProducts);
    };

    const expandProductGroupImage = (mainIndex) => {
        let allProducts = [...productsData];
        allProducts[mainIndex]["pg_image_expanded"] =
            !allProducts[mainIndex]["pg_image_expanded"];
        setProductsData(allProducts);
    };

    const handleCollapse = (index) => {
        let data = [...productsData];
        data[index].collapsed = !data[index].collapsed;
        setProductsData(data);
    };

    const renderItem = ({item, index}) => {
        return (
            <RenderItem
                setQPSModalVisible={setQPSModalVisible}
                setQPSData={setQPSData}
                selectUnitDropdown={selectUnitDropdown}
                setProductQuantity={setProductQuantity}
                selectProductAlert={selectProductAlert}
                expandImage={expandImage}
                get_current_rate={get_current_rate}
                expandProductGroupImage={expandProductGroupImage}
                handleCollapse={handleCollapse}
                item={item} index={index}/>
        )
    }


    return (
        cart.count > 0 ? <View style={{flex: 1, backgroundColor: colors.white}}>
            <PrimaryHeader navigation={props.navigation}/>
            <Indicator isLoading={loading}/>
            <View style={{paddingHorizontal: 12, paddingTop: 20, flex: 1}}>
                <FlatList
                    data={productsData}
                    ItemSeparatorComponent={() => <View style={{height: 20}}></View>}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item.product_group_id + "" + index}
                    renderItem={renderItem}
                    ListFooterComponent={() => <View style={{paddingBottom: 100, paddingTop: 10}}>
                        <View style={styles.underline}>
                            <View style={commonStyles.rowSpaceBetween}>
                                <Text style={texts.redTextBold12}>
                                    Total Items:
                                </Text>
                                <Text style={texts.darkGreyTextBold12}>
                                    {cart.count}
                                </Text>
                            </View>
                            <View style={commonStyles.rowSpaceBetween}>
                                <Text style={texts.redTextBold12}>
                                    Item Total:
                                </Text>
                                <Text style={texts.darkGreyTextBold12}>
                                    {parseFloat(cart.value).toFixed(2)}
                                </Text>
                            </View>
                            {discount !== 0 ? <View style={commonStyles.rowSpaceBetween}>
                                <Text style={texts.redTextBold12}>
                                    Discount:
                                </Text>
                                <Text style={texts.darkGreyTextBold12}>
                                    {0}
                                </Text>
                            </View> : null}
                            {qpsDiscount !== 0 ? <View style={[commonStyles.rowSpaceBetween, {paddingBottom: 4}]}>
                                <Text style={texts.redTextBold12}>
                                    QPS Discount:
                                </Text>
                                <Text style={texts.darkGreyTextBold12}>
                                    {parseFloat(qpsDiscount).toFixed(2)}
                                </Text>
                            </View> : null}
                            <View style={commonStyles.rowSpaceBetween}>
                                <Text style={texts.redTextBold12}>
                                    Net Payable:
                                </Text>
                                <Text style={texts.darkGreyTextBold12}>
                                    {parseFloat(cart.value - discount - qpsDiscount).toFixed(2)}
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
            {qpsModalVisible ? <QPSModal
                modalVisible={qpsModalVisible}
                data={qpsData}
                closeModal={() => {
                    setQPSModalVisible(false);
                }}/> : null}
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
        paddingBottom: 5
    },
    productImage: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 5
    }
})
