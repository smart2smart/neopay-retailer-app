import * as React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import colors from "../assets/colors/colors";
import commonStyles from "../styles/commonStyles";
import {BorderButtonSmallRed} from "../buttons/Buttons";
import texts from "../styles/texts";
import moment from "moment";


function InvoiceCard(props: any) {
    let totalQuantity = 0;

    const buttonStyle = {
        "pending": {backgroundColor: colors.red},
        "approved": {backgroundColor: colors.green},
        "rejected": {backgroundColor: colors.red}
    }

    const viewInvoiceDetails = () => {
        props.goToInvoiceDetails(props.data, props.index, totalQuantity)
    }

    return (
        <TouchableOpacity onPress={viewInvoiceDetails} style={commonStyles.ordersCard}>
            <View style={commonStyles.rowSpaceBetween}>
                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 6}]}>
                    <Text style={texts.darkGreyTextBold12}>Invoice No: </Text>
                    <Text style={texts.primaryTextBold12}>{props.data.invoice_number}</Text>
                </View>
                <View style={[commonStyles.rowAlignCenter, commonStyles.statusButton, buttonStyle[props.data.status]]}>
                    <Text style={[texts.whiteTextBold12, {textTransform: "capitalize"}]}>
                        {props.data.status}
                    </Text>
                </View>
            </View>
            <View style={commonStyles.rowSpaceBetween}>
                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 6}]}>
                    <Text style={texts.darkGreyTextBold12}>Invoice Amount: </Text>
                    <Text style={texts.primaryTextBold12}>{'₹' + props.data.invoice_original_value}</Text>
                </View>
                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 6}]}>
                    <Text style={texts.darkGreyTextBold12}>Pending Amount: </Text>
                    <Text style={texts.primaryTextBold12}>{'₹' + props.data.invoice_pending_value}</Text>
                </View>
            </View>
            <View style={[commonStyles.rowSpaceBetween, {paddingBottom: 10}]}>
                <View style={commonStyles.rowAlignCenter}>
                    <Text style={texts.greyNormal12}>
                        {"Issue Date: "}
                    </Text>
                    <Text style={texts.greyNormal12}>
                        {moment(props.data.invoice_date).format("MMMM D, yy")}
                    </Text>
                </View>
                <View style={commonStyles.rowAlignCenter}>
                    <Text style={texts.greyNormal12}>
                        {"Due Date: "}
                    </Text>
                    <Text style={texts.greyNormal12}>
                        {moment(props.data.invoice_due_date).format("MMMM D, yy")}
                    </Text>
                </View>
            </View>
            <View>
                <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                    <BorderButtonSmallRed ctaFunction={viewInvoiceDetails} text={"View Details"}/>
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

export default InvoiceCard;