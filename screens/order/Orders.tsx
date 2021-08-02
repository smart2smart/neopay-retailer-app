import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    FlatList
} from 'react-native';
// @ts-ignore
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import commonStyles from "../../styles/commonStyles";
import texts from "../../styles/texts";
import {useNavigation} from "@react-navigation/native";
import {useRoute} from '@react-navigation/native';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import {BlueButtonSmall, BorderButtonBigBlue, BorderButtonSmallRed, SolidButtonBlue} from "../../buttons/Buttons";
import OrdersCard from "../../commons/OrdersCard";
import StoreDetails from '../details/StoreDetails';
import * as Linking from "expo-linking";

export default function Orders() {

    const mockData = {
        total_orders: 30,
        order_details: [
            {
                company: 'ITC',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'ORDERED',
            },
            {
                company: 'J&J',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'DELIVERED',
            },
            {
                company: 'ABC',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'CANCELLED',
            },
            {
                company: 'PQR',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'ORDERED',
            },
            {
                company: 'PQR',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'ORDERED',
            },
            {
                company: 'PQR',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'ORDERED',
            },
        ],
    }

    const navigation = useNavigation();
    const route = useRoute();
    const [orderDetails, setOrderDetails] = useState(mockData);

    const orderDescription = (item, index) => {
        return(
            <View style={{marginTop:20}}>
                <ScrollView>
                    <View style={commonStyles.rowSpaceBetween}>
                        <Text style={texts.blackTextBold16}>{item.company} Distributor</Text>
                        <Text style={texts.greyNormal10}>{item.date}{', '}{item.time}</Text>
                    </View>
                    <View style={[commonStyles.rowSpaceBetween, {marginTop:15}]}>
                        <View style={commonStyles.row}>
                            <Text style={texts.greyTextBold12}>Ordered Value : </Text>
                            <Text style={texts.redTextBold12}>Rs {item.order_value}</Text>
                        </View>
                        <View style={{}}>
                            <Text style={texts.greyTextBold12}>{item.status}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={texts.greyTextBold12}>Items : {item.item_count}</Text>
                    </View>
                    <View>
                        <Text style={texts.greyTextBold12}>Delivered by {item.delivery_date}</Text>
                    </View>
                    <View>
                        <View style={[commonStyles.rowSpaceBetween, {marginTop:10}]}>
                            <View style={[commonStyles.row, {width: '50%'}]}>
                                <View>
                                    <BorderButtonBigBlue text={'Supplier'}/>
                                </View>
                                <View style={{marginLeft:10}}>
                                    <BorderButtonBigBlue text={'Salesman'}/>
                                </View>
                            </View>
                            <View style={{width:'30%'}}>
                                <SolidButtonBlue text={'View Details'}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return(
        <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: colors.white }}>
            <SecondaryHeader title={"Orders"}/>
            <View style={[commonStyles.row, {borderWidth:1, borderColor:colors.lightGrey, padding:5, borderRadius:5, marginTop:20}]}>
                <BorderButtonBigBlue text={'Ongoing'}/>
                <BorderButtonBigBlue text={'Completed'}/>
            </View>
            {/* <View>
                <TabButtons data={tabData} selectItem={selectTabButton}/>
            </View> */}
            <View style={[commonStyles.rowSpaceBetween, {marginTop:25}]}>
                <Text style={texts.greyTextBold14}>Total Orders: {orderDetails.total_orders}</Text>
            </View>
            <View style={{marginTop:25, borderBottomColor:colors.lightGrey, borderBottomWidth:1, paddingBottom:20}}>
                <TextInput
                    maxLength={10}
                    placeholder={"Search all orders"}
                    style={commonStyles.textInput}>
                </TextInput>
            </View>
            <View>
                <FlatList
                    data={orderDetails.order_details}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.name + ""}
                    renderItem={({item, index}) =>orderDescription(item, index)}
                    ListFooterComponent={<View style={{paddingBottom:280}}></View>}
                />
            </View>
        </View>
    );
}