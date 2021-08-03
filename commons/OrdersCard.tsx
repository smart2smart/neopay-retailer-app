import * as React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import colors from "../assets/colors/colors";
import commonStyles from "../styles/commonStyles";
import {BlueButtonSmall, BorderButtonSmallRed} from "../buttons/Buttons";
import texts from "../styles/texts";
import moment from "moment";


function OrdersCard(props: any) {
    let itemString = "";

    const buttonStyle = {
        "ordered": {backgroundColor: colors.primary_color},
        "released": {backgroundColor: colors.green},
        "approved": {backgroundColor: colors.green},
        "delivered": {backgroundColor: colors.green},
        "rejected": {backgroundColor: colors.red},
        "returned": {backgroundColor: colors.red},

    }

    props.data.products.map((item) => {
        itemString += item.name + ' x ' + item.value + ' Units' + ", ";
    })

    const viewOrderDetails = () => {
        props.goToOrderDetails(props.data, props.index)
    }

    return (
        <TouchableOpacity onPress={viewOrderDetails} style={commonStyles.ordersCard}>
            <View style={commonStyles.rowSpaceBetween}>
                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 6}]}>
                    <Text style={texts.darkGreyTextBold12}>Order Id: </Text>
                    <Text style={texts.primaryTextBold12}>{props.data.id}</Text>
                </View>
                <View>
                    <Text style={texts.greyNormal12}>
                        {moment(props.data.created_at).format("MMMM D, hh:mm A")}
                    </Text>
                </View>
            </View>
            <View style={commonStyles.rowSpaceBetween}>
                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 6}]}>
                    <Text style={texts.darkGreyTextBold12}>Order value: </Text>
                    <Text style={texts.primaryTextBold12}>{props.data.order_value}</Text>
                </View>
                <View style={[commonStyles.rowAlignCenter, commonStyles.statusButton, buttonStyle[props.data.status]]}>
                    <Text style={[texts.whiteTextBold12, {textTransform: "capitalize"}]}>
                        {props.data.status}
                    </Text>
                </View>
            </View>
            <View style={{flexDirection: "row", flexWrap:"wrap"}}>
                <Text style={texts.darkGreyTextBold12}>Items: </Text>
                <Text style={texts.greyNormal12} textBreakStrategy="simple">
                    {itemString}
                </Text>
            </View>
            <View style={[commonStyles.rowSpaceBetween, {paddingTop: 10}]}>
                <View>

                </View>
                <View>
                    <BorderButtonSmallRed ctaFunction={viewOrderDetails} text={"View Details"}/>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: "center",
    },
})

export default OrdersCard;