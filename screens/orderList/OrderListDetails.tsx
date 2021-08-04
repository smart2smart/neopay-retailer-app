import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    processColor,
    TextInput,
    ScrollView,
    Alert
} from 'react-native';
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import SecondaryHeader from "../../headers/SecondaryHeader";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Feather';

export default function OrderListDetails() {

    const route = useRoute();
    const navigation = useNavigation();
    const [orderDetails, setOrderDetails] = useState(route.params.orderDetailsData);
    const [isLoading, setIsLoading] = useState(false);


    const setOrderData = (data)=>{
        setOrderDetails(data);
    }

    useFocusEffect(
        React.useCallback(() => {
            setOrderData(route.params.orderDetailsData);
        }, [])
    );

    return (
        <ScrollView style={{flex: 1}}>
            <View style={{paddingHorizontal: 24}}>
                <SecondaryHeader title={"Order Details"}/>
                <View style={styles.container}>
                    <View style={commonStyles.rowSpaceBetween}>
                        <View>
                            <View style={commonStyles.row}>
                                <Text style={texts.darkGreyTextBold14}>
                                    Order Id:
                                </Text>
                                <Text style={texts.primaryTextBold14}>
                                    {orderDetails.id}
                                </Text>
                            </View>
                            <View>
                                <Text style={[texts.darkGreyTextBold16, {paddingTop: 10}]}>
                                    {orderDetails.retailer_name}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={[commonStyles.rowAlignCenter, styles.borderBottom, {paddingTop: 10, paddingBottom: 20}]}>
                        <Icon name="map-pin" size={18} color={colors.primary_color}/>
                        <Text style={[texts.greyNormal14, {marginLeft: 10}]}>
                            {orderDetails.retailer_address}
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
                        {orderDetails.products.map((item, index) => {
                            return (<View key={item.name + '' + index}
                                          style={[styles.productListItem, styles.borderBottom]}>
                                <View>
                                    <Text style={texts.darkGreyTextBold14}>
                                        {item.name}
                                    </Text>
                                    <View style={[commonStyles.rowAlignCenter, {marginTop: 8}]}>
                                        <Text style={texts.greyNormal12}>
                                            MRR: {item.mrp}
                                        </Text>
                                        <Text style={[texts.greyNormal12, {marginLeft: 20}]}>
                                            Rate: {item.rate}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={texts.darkGreyTextBold14}>
                                        {item.value}
                                    </Text>
                                </View>
                            </View>)
                        })}
                    </View>
                    <View style={[styles.borderBottom, styles.orderSummary]}>
                        <View style={styles.flexRow}>
                            <Text style={texts.greyTextBold14}>
                                Total Items:
                            </Text>
                            <Text style={texts.greyTextBold14}>
                                {" " + orderDetails.revised_count}
                            </Text>
                        </View>
                        <View style={styles.flexRow}>
                            <Text style={texts.greyTextBold14}>
                                {"Order Value: "}
                            </Text>
                            <Text style={texts.primaryTextBold14}>
                                Rs {orderDetails.order_value}
                            </Text>
                        </View>
                    </View>
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
        padding: 16,
        borderRadius: 5,
        borderColor: colors.grey,
        backgroundColor: '#ffffff',
        elevation: 2
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
        paddingVertical: 12,
        alignItems: 'center'
    },
    borderBottom: {
        paddingBottom: 10,
        borderBottomColor: colors.grey,
        borderBottomWidth: 1
    },
    orderSummary: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: "center"
    }
});