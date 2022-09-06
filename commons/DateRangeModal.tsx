import commonStyles from "@commonStyles";
import {Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import colors from "@colors";
import React, {useEffect, useState} from "react";
import Icon from 'react-native-vector-icons/AntDesign';
import texts from "@texts";
import {BorderButtonSmallRed, BorderButtonSmallBlue} from "@Buttons";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";


export default function DateRangeModal(props) {

    const dateRangeOptions = {
        startDate: new Date(),
        startDateSelected: false,
        endDate: new Date(),
        endDateSelected: false
    }

    const preRangeOptions = [
        {name: "Today", key: 'today'},
        {name: "Last 7 Days", key: 'week'},
        {name: "This Month", key: 'this_month'},
        {name: "Last Month", key: 'last_month'},
        {name: "Last 30 Days", key: 'last_30'},
    ];


    const [startDateShow, setStartDateShow] = useState(false);
    const [endDateShow, setEndDateShow] = useState(false);
    const [dateRange, setDateRange] = useState(dateRangeOptions);

    const onDateChange = (event: any, selectedDate: Date, type: string) => {
        let data = {...dateRange};
        if (type === "start") {
            setStartDateShow(prevState => !prevState);
            data.startDateSelected = true;
            data.startDate = selectedDate;
        } else {
            setEndDateShow(prevState => !prevState);
            data.endDateSelected = true;
            data.endDate = selectedDate;
        }
        setDateRange(data);
    }

    const applyDateRange = (type: string, key: "string") => {
        let startDate = moment(new Date());
        let endDate = moment(new Date()).add(1, 'd');
        let showDate = "";
        if (type === "predefined") {
            if (key === "today") {
                startDate = moment(new Date());
                showDate="Today";
            } else if (key === "week") {
                showDate="Last 7 Days";
                startDate = moment(new Date()).subtract(7, 'd');
            } else if (key === "this_month") {
                showDate="This Month";
                startDate = moment().clone().startOf('month')
            } else if (key === "last_month") {
                showDate="Last Month";
                startDate = moment().clone().subtract(1, 'months').startOf('month')
                endDate = moment().clone().subtract(1, 'months').endOf('month')
            } else if (key === "last_30") {
                showDate="Last 30 Days";
                startDate = moment().subtract(30, 'd');
            }
        } else {
            startDate = moment(dateRange.startDate);
            endDate = moment(dateRange.endDate);
            showDate= endDate.format("DD MMM, yyyy");
        }
        if(startDate>endDate){
            Alert.alert("Start date should be less then end date.");
            return;
        }
        props.closeModal();
        props.getData(startDate.format("yyyy-MM-DD"), endDate.format("yyyy-MM-DD"), showDate);
    }

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.closeModal();
            }}
        >
            <View style={[commonStyles.modalContainer, {backgroundColor: "rgba(0,0,0,0.4)", padding: 10}]}>
                <View style={style.container}>
                    <View style={{flex: 95}}>
                        <View style={style.headerDiv}>
                            <Text style={texts.darkGrey18Bold}>
                                Select Date Range
                            </Text>
                            <TouchableOpacity onPress={() => {
                                props.closeModal();
                            }} style={commonStyles.modalCloseIcon}>
                                <Icon name="close" size={24} color={colors.black}/>
                            </TouchableOpacity>
                        </View>
                        <View style={style.contentDiv}>
                            <View style={style.contentDivLeft}>
                                {preRangeOptions.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index}
                                                          onPress={() => applyDateRange("predefined", item.key)}
                                                          style={style.filterItem}>
                                            <Text style={texts.darkGreyTextBold14}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                            <View style={style.contentDivRight}>
                                <View style={commonStyles.rowAlignCenter}>
                                    <Text style={[texts.greyTextBold14, {marginRight: 10}]}>
                                        Start Date:
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        setStartDateShow(true);
                                    }} style={commonStyles.orangeContainer}>
                                        <Text style={texts.primaryTextBold14}>
                                            {dateRange.startDateSelected ? moment(dateRange.startDate).format("DD MMM, yyyy") :
                                                "Start Date"}
                                        </Text>
                                        {startDateShow && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={dateRange.startDate}
                                                maximumDate={new Date()}
                                                mode={'date'}
                                                display="default"
                                                onChange={(event, date) => {
                                                    onDateChange(event, date, "start")
                                                }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={[commonStyles.rowAlignCenter, {marginTop: 20}]}>
                                    <Text style={[texts.greyTextBold14, {marginRight: 10}]}>
                                        End Date:
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        setEndDateShow(true);
                                    }} style={[commonStyles.orangeContainer]}>
                                        <Text style={texts.primaryTextBold14}>
                                            {dateRange.endDateSelected ? moment(dateRange.endDate).format("DD MMM, yyyy") :
                                                "End Date"}
                                        </Text>
                                        {endDateShow && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                minimumDate={dateRange.startDate}
                                                maximumDate={new Date()}
                                                value={dateRange.endDate}
                                                mode={'date'}
                                                display="default"
                                                onChange={(event, date) => {
                                                    onDateChange(event, date, "end")
                                                }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={style.footer}>
                        <View style={commonStyles.rowAlignCenter}>
                            <View style={{marginTop: 5}}>
                                <BorderButtonSmallRed ctaFunction={() => applyDateRange("custom")} text={"Apply"}/>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 5,
        justifyContent: 'space-between'
    },
    headerDiv: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey
    },
    contentDivLeft: {
        flex: 0.3,
        backgroundColor: '#f8f8f8',
        borderRightWidth: 1,
        borderRightColor: colors.light_grey,
    },
    contentDivRight: {
        flex: 0.7,
        paddingTop: 20,
        paddingLeft: 20
    },
    filterItem: {
        paddingVertical: 20,
        justifyContent: 'center',
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey,
        borderLeftColor: 'transparent',
        borderLeftWidth: 3,
    },
    contentDiv: {
        flex: 1,
        flexDirection: "row",
    },
    footer: {
        paddingTop: 10,
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: colors.light_grey,
        flex: 5,
        padding: 12,
    },
    salesmanContainer: {
        flexDirection: 'row',
        flexWrap: "wrap",
        paddingTop: 16
    },
    salesmanBtn: {
        marginRight: 10,
        marginBottom: 10
    }
})