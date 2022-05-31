import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import texts from "../../styles/texts";
import PrimaryHeader from "../../headers/PrimaryHeader";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import commonStyles from "../../styles/commonStyles";
import {
  BorderButtonSmallBlue,
  BorderButtonSmallRed,
  SolidButtonBlue,
} from "../../buttons/Buttons";
import colors from "../../assets/colors/colors";
import { useDispatch, useSelector } from "react-redux";
import { commonApi } from "../../api/api";
import { AuthenticatedPostRequest } from "../../api/authenticatedPostRequest";
import { AuthenticatedGetRequest } from "../../api/authenticatedGetRequest";
import Indicator from "../../utils/Indicator";
import RenderItem from "../home/ProductCard";
import QPSModal from "../../commons/QPSMOdal";
import useProductsHook from "../custom-hooks/useProductsHook";
import { clearCart } from "../../actions/actions";

function Cart(props: any) {
  let _ = require("underscore");
  const navigation = useNavigation();
  const route = useRoute();
  const cart = useSelector((state: any) => state.cart);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qpsData, setQPSData] = useState({});
  const [qpsDiscount, setQPSDiscount] = useState(0);
  const retailerData = useSelector((state: any) => state.retailerDetails);
  const [qpsModalVisible, setQPSModalVisible] = useState(false);
  const dispatch = useDispatch();

  const goToDistributorProducts = () => {
    navigation.navigate("BuildOrder");
  };

  const {
    productsData,
    setProductsData,
    originalProductsData,
    setOriginalProductsData,
    expandImage,
    expandProductGroupImage,
    toggleView,
    selectUnitDropdown,
    selectProduct,
    setProductQuantity,
    normalView,
    selectProductAlert,
  } = useProductsHook("cart", []);

  const calculateValues = (data) => {
    let cartData: any = [];
    let products: any = {};
    let total = 0;
    let items = 0;
    data.filter((product) => {
      product.data.forEach((item) => {
        if (parseInt(item.quantity) > 0) {
          products[item.id] = {
            quantity: parseInt(item.quantity),
            unit_id: item.selected_unit,
          };
          total +=
            item.selected_unit != 0
              ? parseInt(item.quantity) *
                parseFloat(item.rate) *
                item.lot_quantity
              : parseInt(item.quantity) * parseFloat(item.rate);
          cartData.push(item);
          items += parseInt(item.quantity);
        }
      });
    });
    getDiscount(total, products);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      let data = Object.values(cart.data);
      let groupedData = _.chain(data).groupBy("product_group_id");
      groupedData = groupedData
        .map((value, key) => ({
          company_name: value[0]["company_name"],
          company_id: value[0]["company_id"],
          brand_id: value[0]["brand_id"],
          brand_name: value[0]["brand_name"],
          image: value[0]["product_group_image"],
          product_group_name: value[0]["product_group"],
          collapsed: false,
          image_expanded: false,
          product_group_id: value[0]["product_group_id"],
          data: value,
          pg_image_expanded: false,
        }))
        .value();
      groupedData = _.sortBy(groupedData, function (item) {
        return item.company_name;
      });

      groupedData = groupedData
        .filter((item) => item.data.some((item2) => item2.quantity))
        .map((item) => {
          return {
            ...item,
            data: item.data.filter((item2) => item2.quantity),
          };
        });
      setProductsData(groupedData);
      setOriginalProductsData(groupedData);
      calculateValues(groupedData);
      setLoading(false);
    }, [cart])
  );

  const getProducts = () => {
    let productsToSend = originalProductsData;
    let products: any = {};
    let available = false;

    productsToSend.forEach((product) => {
      product.data.forEach((item) => {
        if (parseInt(item.quantity) > 0) {
          products[item.id] = {
            quantity: parseInt(item.quantity),
            unit_id: parseInt(item.selected_unit),
          };
          available = true;
        }
      });
    });
    return { products, available };
  };

  const placeOrder = () => {
    setLoading(true);
    let { products } = getProducts();
    const dataToSend = {
      method: commonApi.placeOrder.method,
      url: commonApi.placeOrder.url,
      header: commonApi.placeOrder.header,
      data: {
        products: JSON.stringify(products),
        retailer: retailerData.id,
      },
    };
    AuthenticatedPostRequest(dataToSend).then((res) => {
      setLoading(false);
      if (res.status == 201) {
        dispatch(clearCart());
        navigation.goBack();
        Alert.alert("Order placed successfully!!");
      }
    });
  };

  const getDiscount = (total, products) => {
    const data = {
      method: commonApi.getDiscountAmount.method,
      url:
        commonApi.getDiscountAmount.url +
        "?amount=" +
        total +
        "&products=" +
        JSON.stringify(products),
      header: commonApi.getDiscountAmount.header,
    };

    // @ts-ignore
    AuthenticatedGetRequest(data).then((res) => {
      if (res.status == 200) {
        setDiscount(res.data.discount_amount);
        setQPSData(res.data.qps_data);
        setQPSDiscount(parseFloat(res.data.qps_discount).toFixed(2));
      }
    });
  };

  const handleCollapse = (index) => {
    let data = [...productsData];
    data[index].collapsed = !data[index].collapsed;
    setProductsData(data);
  };

  const renderItem = ({ item, index }) => {
    return (
      <RenderItem
        setQPSModalVisible={setQPSModalVisible}
        setQPSData={setQPSData}
        selectUnitDropdown={selectUnitDropdown}
        setProductQuantity={setProductQuantity}
        selectProductAlert={selectProductAlert}
        expandImage={expandImage}
        expandProductGroupImage={expandProductGroupImage}
        handleCollapse={handleCollapse}
        item={item}
        index={index}
      />
    );
  };

  return cart.count > 0 ? (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <PrimaryHeader navigation={props.navigation} />
      <Indicator isLoading={loading} />
      <View style={{ paddingHorizontal: 12, paddingTop: 20, flex: 1 }}>
        <FlatList
          data={productsData}
          ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.product_group_id + "" + index}
          renderItem={renderItem}
          ListFooterComponent={() => (
            <View style={{ paddingBottom: 100, paddingTop: 10 }}>
              <View style={styles.underline}>
                <View style={commonStyles.rowSpaceBetween}>
                  <Text style={texts.redTextBold12}>Total Items:</Text>
                  <Text style={texts.darkGreyTextBold12}>{cart.count}</Text>
                </View>
                <View style={commonStyles.rowSpaceBetween}>
                  <Text style={texts.redTextBold12}>Item Total:</Text>
                  <Text style={texts.darkGreyTextBold12}>
                    {parseFloat(cart.value).toFixed(2)}
                  </Text>
                </View>
                {discount !== 0 ? (
                  <View style={commonStyles.rowSpaceBetween}>
                    <Text style={texts.redTextBold12}>Discount:</Text>
                    <Text style={texts.darkGreyTextBold12}>{0}</Text>
                  </View>
                ) : null}
                {qpsDiscount !== 0 ? (
                  <View
                    style={[commonStyles.rowSpaceBetween, { paddingBottom: 4 }]}
                  >
                    <Text style={texts.redTextBold12}>QPS Discount:</Text>
                    <Text style={texts.darkGreyTextBold12}>
                      {parseFloat(qpsDiscount).toFixed(2)}
                    </Text>
                  </View>
                ) : null}
                <View style={commonStyles.rowSpaceBetween}>
                  <Text style={texts.redTextBold12}>Net Payable:</Text>
                  <Text style={texts.darkGreyTextBold12}>
                    {parseFloat(cart.value - discount - qpsDiscount).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View
                style={[commonStyles.rowSpaceBetween, { marginVertical: 10 }]}
              >
                <View style={{ flex: 1, marginRight: 5 }}>
                  <BorderButtonSmallRed
                    ctaFunction={() => {
                      dispatch(clearCart());
                    }}
                    text={"Clear Cart"}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <BorderButtonSmallBlue
                    ctaFunction={goToDistributorProducts}
                    text={"Add More Items"}
                  />
                </View>
              </View>
            </View>
          )}
        />
      </View>
      <View
        style={[
          commonStyles.row,
          { position: "absolute", bottom: 10, marginHorizontal: 24 },
        ]}
      >
        <SolidButtonBlue ctaFunction={placeOrder} text={"Place Order"} />
      </View>
      {qpsModalVisible ? (
        <QPSModal
          modalVisible={qpsModalVisible}
          data={qpsData}
          closeModal={() => {
            setQPSModalVisible(false);
          }}
        />
      ) : null}
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <PrimaryHeader navigation={props.navigation} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={texts.greyTextBold18}>No items in your cart</Text>
      </View>
    </View>
  );
}

export default Cart;

const styles = StyleSheet.create({
  cardImage: {
    height: 40,
    width: 80,
    backgroundColor: colors.light_grey,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    paddingBottom: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 5,
  },
});
