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
import InvoiceCard from '../../commons/InvoiceCard';
import DateRangeModal from "../../commons/DateRangeModal";
import {BlueButtonSmall, BorderButtonSmallRed} from "../../buttons/Buttons";
import * as Linking from "expo-linking";
import {Feather, MaterialIcons} from "@expo/vector-icons";
import moment from "moment";

export default function InvoiceList() {

    const navigation = useNavigation();
    const route = useRoute();
    const [searchText, setSearchText] = useState('');
    const [invoiceData, setInvoiceData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [endDate, setEndDate] = useState(moment(new Date()).format("DD MMM, yyyy"));
    const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);
    const [originalInvoiceData, setOriginalInvoiceData] = useState([]);

    const showDatePicker = () => {
        setDateRangeModalVisible(true);
    }

    const closeModal = () => {
        setDateRangeModalVisible(false);
    }

    const searchInvoice = (text: string) => {
        if (text !== '') {
            let data = originalInvoiceData.filter((item) => {
                return (item.invoice_original_value).toString().includes(text.toLowerCase()) ||
                    (item.invoice_pending_value).toString().includes(text.toLowerCase()) ||
                    (item.invoice_date).toString().includes(text.toLowerCase()) ||
                    (item.invoice_due_date).toString().includes(text.toLowerCase()) ||
                    item.invoice_number.toLowerCase().includes(text.toLowerCase())
            })
            setInvoiceData(data);
            setSearchText(text);
        } else {
            setInvoiceData(originalInvoiceData);
            setSearchText(text);
        }
    }

    useEffect(() => {
        getInvoiceData(null, null, moment(new Date()).format("DD MMM, yyyy"), "launch");
    }, []);

    const getInvoiceData = (startDate, endDate, showDate, type) => {
        setEndDate(showDate);
        let url = commonApi.getInvoiceList.url + "?source=distributor_app";
        if (startDate) {
            url += "&start_date=" + startDate;
        }
        if (endDate) {
            url += "&end_date=" + endDate;
        }
        const data = {
            method: commonApi.getInvoiceList.method,
            url: url,
            header: commonApi.getInvoiceList.header,
        }
        
        type === "refresh" ? setRefreshing(true) : setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setRefreshing(false);
            setIsLoading(false);
            // setInvoiceData(res.data);
            setOriginalInvoiceData(res.data);
        })
    }

    const goToInvoiceDetails = (data: any, index: number) => {
        navigation.navigate('InvoiceDetails', {
            invoiceDetailsData: data,
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
            <SecondaryHeader title={"Invoice"}/>
            <View style={[commonStyles.searchContainer, {marginTop: 10}]}>
                <TextInput
                    value={searchText}
                    maxLength={10}
                    placeholder={"Search Invoices"}
                    onChangeText={(text) => searchInvoice(text)}
                    style={commonStyles.textInput}>
                </TextInput>
            </View>
            <View style={[commonStyles.rowSpaceBetween, {marginTop: 12}]}>
                <Text style={texts.greyTextBold14}>
                    Invoices Till:
                </Text>
                <TouchableOpacity onPress={showDatePicker} style={commonStyles.orangeContainer}>
                    <Feather name="calendar" size={20} color={colors.orange}/>
                    <Text style={[texts.primaryTextBold12, {marginLeft: 5}]}>
                        {endDate}
                    </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={22} color={colors.orange}/>
                </TouchableOpacity>
                <DateRangeModal
                    getData={getInvoiceData}
                    modalVisible={dateRangeModalVisible}
                    closeModal={closeModal}
                />
            </View>
            {invoiceData.length === 0 && !isLoading ? <View style={[commonStyles.rowCenter, {
                    flex: 1, borderTopWidth: 1,
                    borderTopColor: colors.grey, marginTop: 10
                }]}>
                    <Text style={texts.darkGreyTextBold16}>
                        No invoices available
                    </Text>
                </View> :
                <View style={{paddingTop: 16, flex: 1}}>
                    <FlatList
                        data={invoiceData}
                        onRefresh={() => {
                            getInvoiceData(null, null, moment(new Date()).format("DD MMM, yyyy"), "refresh")
                        }}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => <InvoiceCard index={index} goToInvoiceDetails={goToInvoiceDetails}
                                                                   data={item}/>}
                        keyExtractor={(item, index) => index + ''}
                        ListFooterComponent={renderFooter}
                    />
                </View>}
        </View>
    );
}