import React, {useEffect, useState} from 'react';
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
import PrimaryHeader from "../../headers/PrimaryHeader";

let timeout: any = null;
function OrderList(props) {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [ordersData, setOrdersData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [originalOrdersData, setOriginalOrdersData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [next, setNext] = useState(null);
    const [count, setCount] = useState(0);

    const searchOrders = (text: string) => {
        setSearchText(text);
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (text != "") {
                const data = {
                    method: commonApi.getOrderList.method,
                    url: commonApi.getOrderList.url + "&search=" + text,
                    header: commonApi.getOrderList.header,
                }
                AuthenticatedGetRequest(data).then((res) => {
                    setOrdersData(res.data.results);
                })
            } else {
                setOrdersData(originalOrdersData);
            }
        }, 500);
    }

    useEffect(() => {
        getOrderData(false);
    }, []);

    const getOrderData = (paginate) => {
        let url = "";
        if (searchText !== "") {
            return;
        }
        if (paginate) {
            if (count === ordersData.length) {
                return;
            }
            url = next
        } else {
            url = commonApi.getOrderList.url + "?limit=10&offset=0";
        }

        const data = {
            method: commonApi.getOrderList.method,
            url: url,
            header: commonApi.getOrderList.header,
        }
        setIsLoading(true);
        AuthenticatedGetRequest(data).then((res) => {
            setRefreshing(false);
            setIsLoading(false);
            setCount(res.data.count);
            setNext(res.data.next);
            setOrdersData(paginate ? [...ordersData, ...res.data.results] : res.data.results);
            setOriginalOrdersData(paginate ? [...ordersData, ...res.data.results] : res.data.results);
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
        <View style={{flex: 1}}>
            <Indicator isLoading={isLoading}/>
            <PrimaryHeader navigation={props.navigation}/>
            <View style={{paddingHorizontal: 12, flex: 1}}>
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
                {ordersData.length === 0 && !isLoading ? <View style={[commonStyles.rowCenter, {flex: 1}]}>
                        <Text style={texts.darkGreyTextBold16}>
                            No orders available
                        </Text>
                    </View> :
                    <View style={{paddingTop: 16, flex: 1}}>
                        <FlatList
                            data={ordersData}
                            onRefresh={() => {
                                getOrderData(false)
                            }}
                            refreshing={refreshing}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item, index}) => <OrdersCard index={index} goToOrderDetails={goToOrderDetails}
                                                                       data={item}/>}
                            keyExtractor={(item, index) => index + ''}
                            ListFooterComponent={renderFooter}
                            onEndReached={() => getOrderData(true)}
                            onEndReachedThreshold={0.1}
                        />
                    </View>}
            </View>
        </View>
    )
}

export default connect(
    mapStateToProps,
    {}
)(OrderList);

const styles = StyleSheet.create({});

