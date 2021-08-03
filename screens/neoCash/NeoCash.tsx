import React, {Component, useEffect, useState} from 'react';
import {
    FlatList,
    ScrollView,
    Text,
    View,
} from 'react-native';
// @ts-ignore
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";

export default function NeoCash(props) {

    const mockData = 
    {
        offerDetails: [
            {
                amount_recived: 100,
                expiry_date: '2021-08-15',
                recive_type: 'Completed Quiz #05',
                image: '',
                order_id: 'H07643RET'
            },
            {
                amount_recived: 50,
                expiry_date: '2021-07-31',
                recive_type: 'Completed Quiz #05',
                image: '',
                order_id: 'H07643RET'
            },
            {
                amount_recived: 90,
                expiry_date: '2021-08-07',
                recive_type: 'Completed Quiz #05',
                image: '',
                order_id: 'H07643RET'
            },
        ],
    }

    const [neoCash, setNeoCash] = useState(props.route.params.data);
    const [pointsDetails, setPointsDetails] = useState(mockData);
    const [transactionHistory, setTransactionHistory] = useState(mockData);

    useEffect(() => {
        if(pointsDetails) {
            const data = {...pointsDetails};
            data.offerDetails = data.offerDetails.map(el => {
                return {
                    ...el,
                    daysRemaining: dateDiff(el.expiry_date)
                };
            });
            data.offerDetails = data.offerDetails.sort((x,y) => x.daysRemaining - y.daysRemaining).filter(el => el.daysRemaining > 0);
            // const remDays = data.offerDetails.filter(el => el.daysRemaining < 0)
            // console.log(remDays);

            setPointsDetails(data);
        }
    }, [])

    const dateDiff = (expiryDate) => {
        var currentDate = new Date();
        var expDate = new Date(expiryDate);
       var one_day_ms = 1000 * 60 * 60 * 24;  
       var res = Math.round((expDate.getTime() - currentDate.getTime()) / (one_day_ms) + 1);   
       var finalResult = res.toFixed (0); 
       return finalResult;
    }

    const formatDate = (expiryDate: any) => {
        var date = new Date(expiryDate);
         var month = new Array();
         month[0] = "Jan";
         month[1] = "Feb";
         month[2] = "Mar";
         month[3] = "Apr";
         month[4] = "May";
         month[5] = "Jun";
         month[6] = "Jul";
         month[7] = "Aug";
         month[8] = "Sept";
         month[9] = "Oct";
         month[10] = "Nov";
         month[11] = "Dec";
        var day = date.getDate();
        if(day < 10) {
            day = "0"+day;
        }
        var formattedDate =     day  + " " +month[date.getMonth()] + " " + date.getFullYear();
        return formattedDate
    }

    const dateMonth = (expiryDate: any) => {
        var date = new Date(expiryDate);
         var month = new Array();
         month[0] = "Jan";
         month[1] = "Feb";
         month[2] = "Mar";
         month[3] = "Apr";
         month[4] = "May";
         month[5] = "Jun";
         month[6] = "Jul";
         month[7] = "Aug";
         month[8] = "Sept";
         month[9] = "Oct";
         month[10] = "Nov";
         month[11] = "Dec";
        var day = date.getDate();
        if(day < 10) {
            day = "0"+day;
        }
        var onlyDataMonth =     day  + " " +month[date.getMonth()];
        return onlyDataMonth
    }

    const cashHistory = (item, index) => {
        return(
            <View>
                <View style={[commonStyles.row, {marginBottom:15}]}>
                    <View style={{width:'20%'}}>
                     {(dateDiff(item.expiry_date) > 0) ? <View>
                            <Image style={style.logoImage} source={require("../../assets/images/Ellipse_18.png")}/>
                        </View> : <View>
                            <Image style={style.logoImage} source={require("../../assets/images/Ellipse_19.png")}/>
                        </View>  }
                    </View>
                    <View style={[commonStyles.rowSpaceBetween, {width:'80%'}]}>
                        <View>
                            <Text style={texts.darkGreyTextBold14}>{item.recive_type}</Text>
                            {/* {(dateDiff(item.expiry_date) > 0) ? <Text style={texts.greyNormal12}>{'Expires on '}{item.expiry_date}</Text> : <Text style={texts.greyNormal12}>{'Order id: '}{item.order_id}</Text>} */}
                            {(dateDiff(item.expiry_date) > 0) ? <Text style={texts.greyNormal12}>{'Expires on '}{formatDate(item.expiry_date)}</Text> : <Text style={texts.redTextBold12}>{'EXPIRED'}</Text>}
                        </View>
                        <View>
                            {(dateDiff(item.expiry_date) > 0) ? <Text style={texts.greenNormal15}>+{'₹'}{item.amount_recived}</Text> : <Text style={texts.redTextBold16}>-{'₹'}{item.amount_recived}</Text>}
                            <Text style={texts.darkGreyNormal12}>{dateMonth(item.expiry_date)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    const cashExpire = (item, index) => {
        return(
            <View>
                <ScrollView>
                    <View style={[commonStyles.rowSpaceBetween, {marginTop:10}]}>
                        <Text style={texts.lightRedNormal16}>{'₹'}{item.amount_recived}</Text>
                        <View style={commonStyles.row}>
                            <Text style={texts.darkGreyNormal12}>{'Expiring on'} {formatDate(item.expiry_date)} </Text>
                            <Text style={texts.darkGreyNormal12}>({dateDiff(item.expiry_date)} days rem)</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <SecondaryHeader title={"NeoCash"}/>
            <View style={{backgroundColor:'#F2F2F2', padding:30, marginTop:20, borderRadius:5}}>
                <View style={{alignSelf:'center'}}>
                    <Text style={texts.lightRedBold37}>{'₹'}{neoCash}</Text>
                </View>
                <View style={{alignSelf:'center'}}>
                    <Text style={texts.blackTextBold14}>NeoCash Balance</Text>
                </View>
            </View>
            <View style={{marginTop:20}}>
                <Text style={texts.blackTextBold16}>Expiring Soon</Text>
            </View>
            <View>
                <FlatList 
                    data={pointsDetails.offerDetails}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id + ""}
                    renderItem={({item, index}) =>cashExpire(item, index)}
                />
            </View>
            <View style={{marginTop:20}}>
                <Text style={texts.blackTextBold16}>Transaction History</Text>
            </View>
            <View style={{marginTop:10}}>
                <FlatList 
                    data={transactionHistory.offerDetails}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id + ""}
                    renderItem={({item, index}) =>cashHistory(item, index)}
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    logoImage: {
        height: 50,
        width: 50,
    },
    logoInnerImage: {
        height: 30,
        width: 30,
    },

})