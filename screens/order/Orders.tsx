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
import { TabButtons } from '../../commons/TabButtons';
import Icon from 'react-native-vector-icons/FontAwesome';

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
                supplier_no: 7864323456, 
                salesman_no: 9876543210,
            },
            {
                company: 'J&J',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'COMPLETED',
                supplier_no: 7864323456, 
                salesman_no: 9876543210,
            },
            {
                company: 'ABC',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'CANCELLED',
                supplier_no: 7864323456, 
                salesman_no: 9876543210,
            },
            {
                company: 'PQR',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'ORDERED',
                supplier_no: 7864323456, 
                salesman_no: 9876543210,
            },
            {
                company: 'PQR',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'ORDERED',
                supplier_no: 7864323456, 
                salesman_no: 9876543210,
            },
            {
                company: 'PQR',
                order_value: 4000.00,
                item_count : 8,
                delivery_date: 'March 10',
                date: 'March 1',
                time: '2:30 PM',
                status: 'ORDERED',
                supplier_no: 7864323456, 
                salesman_no: 9876543210,
            },
        ],
    }

    const tabOptions = [
        {key: "ongoing", value: "Ongoing", selected: true},
        {key: "completed", value: "Completed", selected: false},
    ]

    const navigation = useNavigation();
    const route = useRoute();
    const [orderDetails, setOrderDetails] = useState(mockData);
    const [tabData, setTabData] = useState(tabOptions);

    const selectTabButton = (key) => {
        let data = [...tabData];
        data.forEach((item) => {
            item.selected = item.key === key;
        });
        let orderData = [];
        if (key === "all") {
            orderData = [...orderDetails.order_details];
        } else {
            orderData = orderDetails.order_details.filter((item) => {
                return item.status == key;
            })
        }
        setTabData(data);
        // setOrderDetails(orderData);
    }

    const callRetailer = (mobile)=>{
        Linking.openURL(`tel:${mobile}`)
    }

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
                            <View style={{marginTop:4}}>
                                <Text style={texts.redTextBold12}>Rs {item.order_value}</Text>
                            </View>
                        </View>
                        <View style={{}}>
                            {/* <Text style={texts.greyTextBold12}>{item.status}</Text> */}
                            {item.status==="ORDERED"?
                                <View>
                                    <Image resizeMode={"contain"} style={styles.logo} source={require('../../assets/images/Group_965.png')}/>                                    
                                </View>: 
                                <View>
                                    <Image resizeMode={"contain"} style={styles.logo} source={require('../../assets/images/Group_1214.png')}/>   
                                    {/* <BorderButtonSmallRed text={"COMPLETED"} /> */}
                                </View>
                            }
                        </View>
                    </View>
                    <View>
                        <Text style={texts.greyTextBold12}>Items : {item.item_count}</Text>
                    </View>
                    <View>
                        <Text style={texts.greyTextBold12}>Delivered by {item.delivery_date}</Text>
                    </View>
                    <View>
                        <View style={[commonStyles.rowSpaceBetween, {marginTop:10, borderBottomColor:colors.lightGrey, borderBottomWidth:1, paddingBottom:20}]}>
                            <View style={commonStyles.row}>
                                <TouchableOpacity onPress={() => {callRetailer(item.supplier_no)}} style={[commonStyles.row, styles.callIcon]}>
                                    <Icon name="phone" size={14} color={colors.primaryThemeColor}/>
                                    <Text style={texts.primaryThemeTextBold12}> Supplier</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {callRetailer(item.salesman_no)}} style={[commonStyles.row, styles.callIcon, {marginLeft:10}]}>
                                    <Icon name="phone" size={14} color={colors.primaryThemeColor}/>
                                    <Text style={texts.primaryThemeTextBold12}> Salesman</Text>
                                </TouchableOpacity>
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
            <View style={{marginTop:20}}>
                <TabButtons data={tabData} selectItem={selectTabButton}/>
            </View>
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
                    ListFooterComponent={<View style={{paddingBottom:250}}></View>}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        height: 18,
        width: 61,
    },
    callIcon: {
        borderWidth:1, 
        height:30, 
        borderColor:colors.primaryThemeColor, 
        borderRadius:5, 
        alignItems:'center'
    },
})