import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import texts from "@texts";
import PrimaryHeader from "@headers/PrimaryHeader";
import {
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import commonStyles from "@commonStyles";
import {
  BlueButtonMedium,
  BorderButtonSmallRed,
  SolidButtonBlue,
  SolidButtonSmallRed,
} from "@Buttons";
import { connect, useSelector, useDispatch } from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import { removeRetailerCart, clearCartCount } from "@actions";
import Indicator from "@utils/Indicator";
import { commonApi } from "@api";
import { AuthenticatedPostRequest } from "@authenticatedPostRequest";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";
import ProductList from "../build-order/ProductList";
import SecondaryHeader from "@headers/SecondaryHeader";
import colors from "@colors";
import PendingInfoPopup from "./PendingInfoPopup";
import VerifyMobileNumber from "./VerifyMobileNumber";

function Cart(props: any) {
  const dispatch = useDispatch();
  const route = useRoute();
  const [loading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [qpsDiscount, setQPSDiscount] = useState(0);
  const retailerData = useSelector((state: any) => state.retailerDetails);
  const [ShowPendingInfoModal, setShowPendingInfoModal] = useState(false);
  const [ShowVerifyMobileNumber, setShowVerifyMobileNumber] = useState(false);

  const cart = useSelector(
    (state: any) =>
      state.cartDraft || {
        value: 0,
        count: 0,
        data: {},
      }
  );
  const { products, category_1, category_2 } = useSelector(
    (state: any) =>
      state.product || {
        products: [],
        category_1: [],
        category_2: [],
      }
  );

  const getDiscount = () => {
    const cartItems = Object.values(cart.data);

    let value = 0;
    let productsData = {};

    cartItems.forEach((obj) => {
      if (obj.quantity) {
        if (obj.skuId === props.skuItemId)
          value += obj.quantity * obj.rate * unit.quantity;
        else value += obj.quantity * obj.rate * obj.unit_quantity;

        productsData[obj.skuId] = obj;
      }
    });

    const data = {
      method: commonApi.getDiscountAmount.method,
      url:
        commonApi.getDiscountAmount.url +
        "?amount=" +
        value +
        "&products=" +
        JSON.stringify(productsData),
      header: commonApi.getDiscountAmount.header,
    };
    AuthenticatedGetRequest(data).then((res) => {
      if (res.status == 200) {
        setDiscountAmount(res.data.discount_amount);
        setQPSDiscount(res.data.qps_discount);
      }
    });
  };

  useEffect(() => {
    if (cart.count) {
      getDiscount();
    }
  }, [cart.value]);

  // useEffect(() => {
  //     if (route.params) {
  //         if (route.params.comingFrom == "edit") {
  //             let order_products = {};
  //             route.params.existingOrderData.product_list.forEach((item) => {
  //                 order_products[item.id] = item;
  //             });
  //             updateProductsForEditOrder(
  //                 order_products,
  //                 products.products,
  //                 route.params.retailerData
  //             );
  //         } else {
  //             let cartData = cart.data;
  //             if (cartData) {
  //                 let data = route.params.productsData;
  //                 let current = data[data.length - 1].data;
  //                 let filteredData = current.map((item: any) => {
  //                     return {
  //                         ...item,
  //                         data: item.data.filter((product: any) => {
  //                             return cartData[product.id];
  //                         }),
  //                     };
  //                 });
  //                 let removeBoolean = filteredData.filter((item) => {
  //                     return item.data.length > 0;
  //                 });
  //                 let final = [
  //                     {title: "Products", collapsed: false, data: removeBoolean},
  //                 ];
  //                 setProductsData(final);
  //             }
  //         }
  //         setIsLoading(false);
  //     }
  // }, [route.params]);

  // const getProducts = (type) => {
  //     let data = cart ? cart.data : {};
  //     let products = {};
  //     Object.keys(data).forEach((item) => {
  //         if (type == "edit") {
  //             products[item] = data[item].quantity
  //                 ? parseInt(data[item].quantity)
  //                 : 0;
  //         } else {
  //             products[item] = {
  //                 quantity: data[item].quantity ? parseInt(data[item].quantity) : 0,
  //                 unit_id: data[item].selected_unit,
  //             };
  //         }
  //     });
  //     return products;
  // };

  const placeOrder = () => {
    // const type = route.params.comingFrom;
    // const method =
    //   type === "edit"
    //     ? commonApi.editOrder.method
    //     : commonApi.placeOrder.method;
    // let url =
    //   type === "edit"
    //     ? commonApi.editOrder.url + route.params.existingOrderData.id + "/"
    //     : commonApi.placeOrder.url;
    // const header =
    //   type === "edit"
    //     ? commonApi.editOrder.header
    //     : commonApi.placeOrder.header;
    if (cart?.count) {
      let productsData = {};

      Object.values(cart.data).forEach((obj) => {
        if (obj.quantity) {
          productsData[obj.skuId] = obj;
        }
      });

      setIsLoading(true);
      let current = {
        retailer: retailerData.id,
        products: JSON.stringify(productsData),
      };
      // if (type == "edit") {
      //   (current["edit_type"] = "salesman_edit"), (current["status"] = "ordered");
      // }
      const dataToSend = {
        ...commonApi.placeOrder,
        data: current,
      };
      AuthenticatedPostRequest(dataToSend).then((res) => {
        setIsLoading(false);
        if (res) {
          if (res.status == 200 || res.status == 201) {
            clearCart();
            navigation.navigate("OrderListDetails", {
              orderDetailsData: res.data[0],
            });
          }
        }
      });
    } else {
      Alert.alert("Please add atleast a Product");
    }
  };

  const clearCart = (type) => {
    dispatch(clearCartCount());
    dispatch(removeRetailerCart());
  };

  const goBack = (type) => {
    navigation.navigate("BuildOrder");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ marginHorizontal: 15 }}>
        <SecondaryHeader title="Cart" />
      </View>
      <Indicator isLoading={loading} />
      <View style={{ paddingHorizontal: 5, flex: 1 }}>
        <ProductList
          products={products
            .filter((item) =>
              item.data.some(
                (skuItem) => cart?.data && cart?.data[skuItem.id]?.quantity
              )
            )
            .map((item) => {
              return {
                ...item,
                data: item.data.filter(
                  (skuItem) => cart?.data[skuItem.id]?.quantity
                ),
              };
            })}
          hideCategorySection={true}
        />
        <View style={[commonStyles.rowSpaceBetween, { marginVertical: 10 }]}>
          <View style={{ marginHorizontal: 20 }}>
            <SolidButtonBlue ctaFunction={goBack} text={"Add More Items"} />
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <BorderButtonSmallRed ctaFunction={clearCart} text={"Clear Cart"} />
          </View>
        </View>
        <View style={[styles.underlineTop, { paddingTop: 10 }]}>
          <View style={[commonStyles.rowSpaceBetween, { paddingBottom: 4 }]}>
            <Text style={texts.greyTextBold16}>Total Items:</Text>
            <Text style={texts.greyTextBold16}>
              {cart?.count ? cart?.count : 0}
            </Text>
          </View>
          <View style={[commonStyles.rowSpaceBetween, { paddingBottom: 4 }]}>
            <Text style={texts.greyTextBold16}>Item Total:</Text>
            <Text style={texts.greyTextBold16}>
              {parseFloat(cart?.value ? cart?.value : 0).toFixed(2)}
            </Text>
          </View>
          {discountAmount !== 0 ? (
            <View style={[commonStyles.rowSpaceBetween, { paddingBottom: 4 }]}>
              <Text style={texts.darkGreyTextBold16}>Discount:</Text>
              <Text style={texts.darkGreyTextBold16}>
                {discountAmount.toFixed(2)}
              </Text>
            </View>
          ) : null}
          {qpsDiscount !== 0 ? (
            <View style={[commonStyles.rowSpaceBetween, { paddingBottom: 4 }]}>
              <Text style={texts.darkGreyTextBold16}>QPS Discount:</Text>
              <Text style={texts.darkGreyTextBold16}>
                {parseFloat(qpsDiscount).toFixed(2)}
              </Text>
            </View>
          ) : null}
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={texts.darkGreyTextBold16}>Net Payable:</Text>
            <Text style={texts.darkGreyTextBold16}>
              {parseFloat(
                cart?.value
                  ? cart.value
                  : 0 - (discountAmount || 0) - (qpsDiscount || 0)
              ).toFixed(2)}
            </Text>
          </View>
        </View>
        <View
          style={
            ([commonStyles.row],
            {
              marginTop: 5,
              marginHorizontal: 20,
              marginBottom: 10,
            })
          }
        >
          <BlueButtonMedium
            ctaFunction={() => {
              placeOrder();
            }}
            text={"Place Order"}
          />
        </View>
      </View>
      {/* {ShowPendingInfoModal ? (
        <PendingInfoPopup
          visible={ShowPendingInfoModal}
          onClose={() => {
            setShowPendingInfoModal(false);
          }}
          onSubmit={() => {
            setShowPendingInfoModal(false);
            placeOrder();
          }}
          retailerDetails={retailerData}
        />
      ) : null}

      {ShowVerifyMobileNumber ? (
        <VerifyMobileNumber
          visible={ShowVerifyMobileNumber}
          onClose={() => {
            setShowVerifyMobileNumber(false);
          }}
          onSubmit={() => {
            setShowVerifyMobileNumber(false);
            placeOrder();
          }}
          retailerDetails={retailerData}
        />
      ) : null} */}
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
    paddingBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 5,
  },
  underlineTop: {
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    paddingHorizontal: 12,
  },
});
