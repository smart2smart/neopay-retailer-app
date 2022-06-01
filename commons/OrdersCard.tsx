import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../assets/colors/colors";
import commonStyles from "../styles/commonStyles";
import { BorderButtonSmallBlue } from "../buttons/Buttons";
import texts from "../styles/texts";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Linking from "expo-linking";

const buttonStyle = {
  ordered: { backgroundColor: colors.primaryThemeColor },
  released: { backgroundColor: colors.green },
  approved: { backgroundColor: colors.green },
  delivered: { backgroundColor: colors.green },
  rejected: { backgroundColor: colors.red },
  returned: { backgroundColor: colors.red },
  cancelled: { backgroundColor: colors.red },
};

function OrdersCard(props: any) {
  let itemString = "";

  props.data.product_list.map((item) => {
    itemString += item.name + " x " + item.value + " Units" + ", ";
  });

  const viewOrderDetails = () => {
    props.goToOrderDetails(props.data, props.index);
  };

  const callRetailer = (mobile) => {
    Linking.openURL(`tel:${mobile}`);
  };

  return (
    <TouchableOpacity
      onPress={viewOrderDetails}
      style={commonStyles.ordersCard}
    >
      <View style={commonStyles.rowSpaceBetween}>
        <View style={[commonStyles.rowAlignCenter, { paddingVertical: 6 }]}>
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
        <View style={[commonStyles.rowAlignCenter, { paddingVertical: 6 }]}>
          <Text style={texts.darkGreyTextBold12}>Order value: </Text>
          <Text style={texts.primaryTextBold12}>
            {parseFloat(props.data.revised_value).toFixed(2)}
          </Text>
        </View>
        <View
          style={[
            commonStyles.rowAlignCenter,
            commonStyles.statusButton,
            buttonStyle[props.data.status],
          ]}
        >
          <Text
            style={[texts.whiteTextBold12, { textTransform: "capitalize" }]}
          >
            {props.data.status}
          </Text>
        </View>
      </View>
      <View style={commonStyles.rowSpaceBetween}>
        <View style={[commonStyles.rowAlignCenter, { paddingVertical: 6 }]}>
          <Text style={texts.darkGreyTextBold12}>
            {props.data.distributor_name}
          </Text>
        </View>
        {props.data.created_by !== "" ? (
          <View style={[commonStyles.rowAlignCenter, { paddingVertical: 6 }]}>
            <Text style={texts.darkGreyTextBold12}>Created by: </Text>
            <Text style={texts.primaryTextBold12}>
              {props.data.created_by === "retailer"
                ? "Self"
                : props.data.created_by === "salesman"
                ? props.data.salesman_name
                : "Partner"}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Text style={texts.darkGreyTextBold12}>Items: </Text>
        <Text style={texts.greyNormal12} textBreakStrategy="simple">
          {itemString}
        </Text>
      </View>
      <View style={[commonStyles.rowSpaceBetween, { paddingTop: 10 }]}>
        <View style={commonStyles.row}>
          <TouchableOpacity
            onPress={() => {
              callRetailer(props.data.distributor_contact);
            }}
            style={[
              commonStyles.borderButtonSmallBlue,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Icon name="phone" size={14} color={colors.primaryThemeColor} />
            <Text style={texts.primaryTextBold12}> Supplier</Text>
          </TouchableOpacity>
          {props.data.salesman ? (
            <TouchableOpacity
              onPress={() => {
                callRetailer(props.data.salesman_contact);
              }}
              style={[
                commonStyles.borderButtonSmallBlue,
                { flexDirection: "row", marginLeft: 10 },
              ]}
            >
              <Icon name="phone" size={14} color={colors.primaryThemeColor} />
              <Text style={texts.primaryTextBold12}> Salesman</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View>
          <BorderButtonSmallBlue
            ctaFunction={viewOrderDetails}
            text={"View Details"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  callIcon: {
    borderWidth: 1,
    height: 30,
    borderColor: colors.primaryThemeColor,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
  },
});

export default OrdersCard;
