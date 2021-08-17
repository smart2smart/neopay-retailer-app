import React, { useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, FlatList} from 'react-native';
import commonStyles from "../../styles/commonStyles";
import SecondaryHeader from "../../headers/SecondaryHeader";
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import OrdersCard from '../../commons/OrdersCard';
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import {useNavigation} from "@react-navigation/native";
import Indicator from "../../utils/Indicator";
import mapStateToProps from "../../store/mapStateToProps";
import {connect, useSelector} from "react-redux";

function OrderList() {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [ordersData, setOrdersData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [originalOrdersData, setOriginalOrdersData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchOrders = (text: string) => {
        if (text !== '') {
            let data = originalOrdersData.filter((item) => {
                return item.retailer_name.toLowerCase().includes(text.toLowerCase()) ||
                    item.salesman_name.toLowerCase().includes(text.toLowerCase())
            })
            setOrdersData(data);
            setSearchText(text);
        } else {
            setOrdersData(originalOrdersData);
            setSearchText(text);
        }
    }

    useEffect(() => {
        getOrderData();
    }, []);

    const getOrderData = () => {
        const data = {
            method: commonApi.getOrderList.method,
            url: commonApi.getOrderList.url,
            header: commonApi.getOrderList.header,
        }
        setIsLoading(true);
        AuthenticatedGetRequest(data).then((res) => {
            setRefreshing(false);
            setIsLoading(false);
            setOrdersData(res.data);
            setOriginalOrdersData(res.data);
        })
    }

    const goToOrderDetails = (data: any, index: number) => {
        navigation.navigate('OrderListDetails', {
            orderDetailsData: data,
        });
    }

    const renderFooter = () => {
        return (
            <View style={{borderBottomWidth: 1, borderBottomColor: colors.grey, marginBottom: 20}}>

            </View>
        )
    }

    return (
        <View style={{flex: 1, paddingHorizontal: 24}}>
            <Indicator isLoading={isLoading}/>
            <SecondaryHeader title={"Orders"}/>
            <View style={[commonStyles.searchContainer, {marginTop: 10}]}>
                <TextInput
                    value={searchText}
                    maxLength={10}
                    placeholder={"Search Orders"}
                    onChangeText={(text) => searchOrders(text)}
                    style={commonStyles.textInput}>
                </TextInput>
            </View>
            <View style={[commonStyles.rowSpaceBetween, {paddingTop: 16}]}>
                <Text style={texts.greyTextBold14}>
                    Orders Till:
                </Text>
            </View>
            {ordersData.length===0 && !isLoading?<View style={[commonStyles.rowCenter, {flex:1}]}>
                    <Text style={texts.darkGreyTextBold16}>
                        No orders available
                    </Text>
                </View>:
                <View style={{paddingTop: 16, flex: 1}}>
                    <FlatList
                        data={ordersData}
                        onRefresh={()=>{getOrderData()}}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => <OrdersCard index={index} goToOrderDetails={goToOrderDetails}
                                                                   data={item}/>}
                        keyExtractor={(item, index) => index + ''}
                        ListFooterComponent={renderFooter}
                    />
                </View>}
        </View>
    )
}

export default connect(
    mapStateToProps,
    {}
)(OrderList);

const styles = StyleSheet.create({});

