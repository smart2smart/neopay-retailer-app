import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import SecondaryHeader from "../../headers/SecondaryHeader";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Feather';
import {BorderButtonSmallBlue} from "../../buttons/Buttons";
import * as WebBrowser from 'expo-web-browser';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";

export default function OrderListDetails() {

    const route = useRoute();
    const [orderDetails, setOrderDetails] = useState(route.params.orderDetailsData);
    const [retailerDetails, setRetailerDetails] = useState({});


    const setOrderData = (data) => {
        setOrderDetails(data);
    }

    useFocusEffect(
        React.useCallback(() => {
            setOrderData(route.params.orderDetailsData);
        }, [])
    );

    useEffect(() => {
        getRetailerDetails();
    }, [])

    const getRetailerDetails = () => {
        const data = {
            method: commonApi.getRetailerDetails.method,
            url: commonApi.getRetailerDetails.url,
            header: commonApi.getRetailerDetails.header
        }
        AuthenticatedGetRequest(data).then((res) => {
            if (res.data) {
                setRetailerDetails(res.data)
            }
        })

    }

    const downloadInvoice = (invoiceUrl) => {
        if (invoiceUrl) {
            WebBrowser.openBrowserAsync(invoiceUrl);
        } else {
            Alert.alert("Invoice not available. Order not approved yet.")
        }
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
            <View style={{paddingHorizontal: 12}}>
                <SecondaryHeader title={"Order Details"}/>
                <View style={styles.container}>
                    <View style={commonStyles.rowSpaceBetween}>
                        <View>
                            <View style={commonStyles.rowAlignCenter}>
                                <Text style={texts.darkGreyTextBold12}>
                                    Order Id:
                                </Text>
                                <Text style={texts.primaryTextBold12}>
                                    {orderDetails.id}
                                </Text>
                            </View>
                            <View>
                                <Text style={[texts.darkGreyTextBold14]}>
                                    {retailerDetails.name}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={[commonStyles.rowAlignCenter, styles.borderBottom, {paddingBottom: 10}]}>
                        <Icon name="map-pin" size={18} color={colors.primary_color}/>
                        <Text style={[texts.greyNormal12, {marginLeft: 10}]}>
                            {retailerDetails.address_str}
                        </Text>
                    </View>
                    <View>
                        <View style={[styles.productHeader, commonStyles.rowSpaceBetween]}>
                            <Text style={texts.blueBoldl14}>
                                Ordered Items
                            </Text>
                            <Text style={texts.blueBoldl14}>
                                Quantity
                            </Text>
                        </View>
                        {orderDetails.product_list.map((item, index) => {
                            let name = item.name;
                            if (item.unit_label !== item.level_0_label) {
                                name = item.name + " - " + item.unit_label
                            }
                            return (<View key={item.name + '' + index}
                                          style={[styles.productListItem, styles.borderBottom]}>
                                <View style={{width:"75%"}}>
                                    <Text style={texts.darkGreyTextBold12}>
                                        {name}
                                    </Text>
                                    <View style={[commonStyles.rowAlignCenter]}>
                                        <Text style={texts.greyNormal12}>
                                            MRR: {item.mrp}
                                        </Text>
                                        <Text style={[texts.greyNormal12, {marginLeft: 20}]}>
                                            Rate: {parseFloat(item.rate * item.lot_quantity).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{alignItems: "flex-end"}}>
                                    <Text style={texts.darkGreyTextBold12}>
                                        {item.value}
                                    </Text>
                                    {item.unit_label !== item.level_0_label ?
                                        <Text style={texts.greyTextBold12}>
                                            {"(" + item.value * item.lot_quantity + " " + item.level_0_label}{item.unit_label !== item.level_0_label || item.value > 1 ? "s" : ""}{")"}
                                        </Text> : null}
                                </View>
                            </View>)
                        })}
                    </View>
                    <View style={[styles.borderBottom, styles.orderSummary]}>
                        <View style={styles.flexRow}>
                            <Text style={texts.greyTextBold12}>
                                Total Items:
                            </Text>
                            <Text style={texts.greyTextBold12}>
                                {" " + orderDetails.revised_count}
                            </Text>
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={texts.greyTextBold12}>
                                {"Order Value: "}
                            </Text>
                            <Text style={texts.primaryTextBold12}>
                                Rs {parseFloat(orderDetails.revised_value).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    {orderDetails.status === "delivered" ?
                        <View style={{flexDirection: "row", justifyContent: "flex-end", marginTop: 10}}>
                            <BorderButtonSmallBlue ctaFunction={() => {
                                downloadInvoice(orderDetails.invoice)
                            }} text={"Invoice"}/>
                        </View> : null}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 20
    },
    container: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        borderColor: colors.grey,
        backgroundColor: '#ffffff',
        elevation: 2,
        marginBottom: 20
    },
    retailerDiv: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        paddingVertical: 10
    },
    callIconDiv: {
        width: 30,
        height: 30,
        borderRadius: 5,
        borderColor: colors.primary_color,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    callIcon: {
        width: 15,
        height: 15
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingTop: 10
    },
    productListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 6,
        alignItems: 'center'
    },
    borderBottom: {
        borderBottomColor: colors.grey,
        borderBottomWidth: 1
    },
    orderSummary: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: "center"
    }
});
