import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import mapStateToProps from "../../store/mapStateToProps";

import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import colors from "../../assets/colors/colors";

const CartButton = (props) => {
  const navigation = useNavigation();
  const cartData = useSelector((state: any) => state.cartDraft);
  
  const openCart = () => {
    navigation.navigate("Cart");
  };

  return cartData?.count ? (
    <TouchableOpacity onPress={openCart} style={styles.footer}>
      <View style={{ flexDirection: "column" }}>
        <View style={commonStyles.row}>
          <Text style={texts.whiteNormal14}>We saved your progress!</Text>
        </View>
        <View style={commonStyles.row}>
          <Text style={texts.whiteTextBold16}>{`${parseInt(
            cartData?.count
          )} Items | `}</Text>
          <Text style={texts.whiteTextBold16}>
            {"Rs. " + parseFloat(cartData.value).toFixed(2)}
          </Text>
        </View>
      </View>
      <View>
        <View
          style={{
            position: "absolute",
            left: 5,
            right: 0,
            bottom: 20,
            borderRadius: 60,
            backgroundColor: colors.primaryThemeColor,
            borderColor: colors.primaryThemeColor,
            borderWidth: 2,
            elevation: 4,
            shadowColor: "#000",
            padding: 10,
            height: 60,
            width: 60,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../assets/icons/cart.png")}
          />
        </View>
        <Text style={[texts.whiteTextBold12, { textTransform: "uppercase" }]}>
          view cart
        </Text>
      </View>
    </TouchableOpacity>
  ) : null;
};

export default connect(mapStateToProps, null)(CartButton);

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.primaryThemeColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 8000,
  },
});
