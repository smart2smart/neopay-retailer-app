import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import commonStyles from "./styles/commonStyles";
import texts from "./styles/texts";
import colors from "./assets/colors/colors";
import {SolidButtonBlue} from "./buttons/Buttons";
import React from "react";

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