import React, { PureComponent, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";

import texts from "@texts";
import commonStyles from "@commonStyles";
import { BorderButtonSmallRed } from "@Buttons";
import { setCartDraft } from "@actions";
import { useIsFocused } from "@react-navigation/native";
import colors from "@colors";

type AddToCartButtonProps = {
  skuItemId: any;
  skuItem: any;
  hideCategorySection: any;
  setCategory2?: Function;
};

const AddToCartButton = (props: AddToCartButtonProps) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const [selectedUnitQty, setUnitQty] = useState({});
  const cartData = useSelector((state: any) =>
    state.cartDraft ? state.cartDraft : { data: {}, count: 0, value: 0 }
  );

  const storeCartData = (data) => {
    dispatch(setCartDraft(data));
  };

  const [Qty, setQuantity] = useState(
    cartData?.data && cartData?.data[`${props?.skuItemId}`] && props?.skuItemId
      ? cartData?.data && cartData?.data[`${props?.skuItemId}`]?.quantity
      : 0
  );

  const unit_data = useMemo(() => {
    let unit_data = [];
    let units = props.skuItem?.unit_conversion;

    // if (props.skuItem?.level_0_enabled) {
    unit_data.push({
      label: props.skuItem?.level_0_label,
      value: 0,
      quantity: 1,
    });
    // }

    if (units) {
      if (props.skuItem?.level_1_enabled && units?.level_1_unit) {
        unit_data.push({
          label: `${units?.level_1_name} (${units.level_1_qty})`,
          value: units?.level_1_unit,
          quantity: units?.level_1_qty,
        });
      }
      if (props.skuItem.level_2_enabled && units?.level_2_unit) {
        unit_data.push({
          label: `${units?.level_2_name} (${units?.level_2_qty})`,
          value: units?.level_2_unit,
          quantity: units?.level_2_qty,
        });
      }
    }
    setUnitQty(unit_data[0]);
    return unit_data;
  }, [props.skuItem]);

  useEffect(() => {
    if (cartData?.data && cartData?.data[`${props?.skuItemId}`]) {
      setQuantity(cartData?.data[`${props?.skuItemId}`]?.quantity);
      if (cartData?.data && cartData?.data[`${props?.skuItemId}`]?.unit_id)
        setUnitQty({
          value: cartData?.data[`${props?.skuItemId}`]?.unit_id,
          label: cartData?.data[`${props?.skuItemId}`]?.unit_label,
          quantity: cartData?.data[`${props?.skuItemId}`]?.unit_quantity,
        });
    }
  }, [props?.skuItemId, focused]);

  return (
    <View>
      <View style={{ alignSelf: "flex-end", width: "100%" }}>
        {props.showMrp ? (
          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={[texts.greenBold14]}>{props.skuItem.mrp}</Text>
            <Text style={[texts.darkGreyTextBold12, { textAlign: "right" }]}>
              {parseFloat(
                selectedUnitQty?.quantity * props.skuItem.rate
              ).toFixed(2) + " Rs."}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              texts.darkGreyTextBold12,
              { textAlign: "right", marginBottom: 3 },
            ]}
          >
            {parseFloat(selectedUnitQty?.quantity * props.skuItem.rate).toFixed(
              2
            ) + " Rs."}
          </Text>
        )}
        {(props.skuItem.level_1_enabled || props.skuItem.level_2_enabled) &&
          props.skuItem.unit_conversion &&
          (props.skuItem.unit_conversion.level_1_unit ||
            props.skuItem.unit_conversion.level_2_unit) && (
            <View style={{ width: 80, marginLeft: "auto" }}>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                maxHeight={36 * unit_data.length}
                selectedTextStyle={texts.redTextBold10}
                renderItem={(unit) => {
                  return (
                    <View
                      style={{
                        height: 36,
                        paddingLeft: 10,
                        justifyContent: "center",
                        backgroundColor:
                          props?.skuItem.unit_id == unit.value
                            ? colors.light_grey
                            : colors.white,
                        borderBottomColor: colors.light_grey,
                        borderBottomWidth: 1,
                      }}
                    >
                      <Text
                        style={
                          props?.skuItem.unit_id == unit.value
                            ? texts.redTextBold12
                            : texts.greyTextBold12
                        }
                      >
                        {unit.label}
                      </Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownPosition={"bottom"}
                data={unit_data}
                labelField="label"
                valueField="value"
                value={
                  (cartData?.data &&
                    cartData?.data[`${props?.skuItemId}`]?.unit_id) ||
                  0
                }
                placeholder="Select item"
                onChange={(unit) => {
                  setUnitQty(unit);
                  if (cartData?.data && cartData?.data[`${props?.skuItemId}`]) {
                    const cartItems = Object.values(cartData?.data);

                    let value = 0;

                    cartItems.forEach((obj) => {
                      if (obj.skuId === props.skuItemId)
                        value += obj.quantity * obj.rate * unit.quantity;
                      else value += obj.quantity * obj.rate * obj.unit_quantity;
                    });

                    storeCartData({
                      ...cartData,
                      value: parseFloat(value).toFixed(2),
                      data: {
                        ...cartData?.data,
                        [props.skuItemId]: {
                          ...cartData?.data[props.skuItemId],
                          unit_id: unit.value,
                          unit_label: unit.label,
                          unit_quantity: unit.quantity,
                        },
                      },
                    });
                  }
                }}
              />
            </View>
          )}
      </View>
      {!(cartData && cartData?.data && cartData?.data[props.skuItemId]) ? (
        <BorderButtonSmallRed
          style={{
            height: 24,
          }}
          ctaFunction={() => {
            if (!props.hideCategorySection && props.setCategory2) {
              props.setCategory2((oldData) =>
                oldData.map((data) =>
                  data.id === props.skuItem.category_2_id
                    ? { ...data, count: data.count + 1 }
                    : { ...data }
                )
              );
            }
            setQuantity(1);
            storeCartData({
              count: cartData?.count ? cartData.count + 1 : 1,
              value: cartData?.count
                ? parseFloat(cartData?.value) +
                  selectedUnitQty.quantity * parseFloat(props.skuItem.rate)
                : parseFloat(props.skuItem.rate) * selectedUnitQty.quantity,
              data: {
                ...cartData?.data,
                [props.skuItemId]: {
                  skuId: props.skuItemId,
                  quantity: 1,
                  unit_id: selectedUnitQty.value,
                  unit_label: selectedUnitQty.label,
                  unit_quantity: selectedUnitQty.quantity,
                  rate: props.skuItem.rate,
                },
              },
            });
          }}
          text={"Add"}
        />
      ) : (
        <View style={styles.quantityButton}>
          <TouchableOpacity
            onPress={() => {
              if (
                cartData?.data &&
                cartData?.data[props.skuItemId]?.quantity - 1 <= 0
              )
                if (!props.hideCategorySection && props.setCategory2) {
                  props.setCategory2((oldData) =>
                    oldData.map((data) =>
                      data.id === props.skuItem.category_2_id
                        ? {
                            ...data,
                            count: data.count > 1 ? data.count - 1 : 0,
                          }
                        : { ...data }
                    )
                  );
                }
              if (
                cartData?.data &&
                cartData?.data[props.skuItemId]?.quantity - 1 <= 0
              ) {
                setQuantity(0);
                let newData = {
                  ...cartData,
                  count: cartData.count - 1,
                  value:
                    parseFloat(cartData?.value) -
                    parseFloat(props.skuItem.rate) * selectedUnitQty.quantity,
                };
                delete newData.data[props.skuItemId];
                storeCartData({ ...newData });
              } else {
                setQuantity(parseInt(Qty) - 1);
                storeCartData({
                  count: cartData.count,
                  value:
                    parseFloat(cartData?.value) -
                    parseFloat(props.skuItem.rate) *
                      cartData?.data[props.skuItemId].unit_quantity,
                  data: {
                    ...cartData?.data,
                    [props.skuItemId]: {
                      ...cartData?.data[props.skuItemId],
                      quantity: cartData?.data[props.skuItemId]?.quantity - 1,
                    },
                  },
                });
              }
            }}
            style={styles.addSubtractButton}
          >
            <Text style={texts.whiteTextBold16}>-</Text>
          </TouchableOpacity>
          <TextInput
            value={Qty?.toString()}
            keyboardType={"numeric"}
            onBlur={() => {
              storeCartData({
                count: cartData.count,
                value:
                  parseFloat(cartData?.value) +
                  (parseInt(Qty) -
                    cartData?.data[`${props?.skuItemId}`]?.quantity) *
                    parseFloat(props.skuItem.rate) *
                    cartData?.data[props.skuItemId].unit_quantity,
                data: {
                  ...cartData?.data,
                  [props.skuItemId]: {
                    ...cartData?.data[props.skuItemId],
                    quantity: parseInt(Qty),
                  },
                },
              });
            }}
            onChangeText={(text) => {
              setQuantity(text);
            }}
            style={[texts.darkGreyTextBold12, styles.cartInput]}
          ></TextInput>
          <TouchableOpacity
            onPress={() => {
              setQuantity(parseInt(Qty) + 1);
              storeCartData({
                count: cartData.count,
                value:
                  parseFloat(cartData?.value) +
                  parseFloat(props.skuItem.rate) *
                    cartData?.data[props.skuItemId].unit_quantity,
                data: {
                  ...cartData?.data,
                  [props.skuItemId]: {
                    ...cartData?.data[props.skuItemId],
                    quantity:
                      cartData?.data[`${props?.skuItemId}`]?.quantity + 1,
                  },
                },
              });
            }}
            style={styles.addSubtractButton}
          >
            <Text style={texts.whiteTextBold16}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddToCartButton;

const styles = StyleSheet.create({
  productListItem: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    alignItems: "center",
  },
  quantityButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 24,
  },
  addSubtractButton: {
    width: 24,
    height: 24,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  cartInput: {
    width: 35,
    height: 24,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 3,
    textAlign: "center",
  },
  dropdown: {
    backgroundColor: "white",
    marginBottom: 4,
    borderRadius: 4,
    height: 25,
    width: 80,
    alignSelf: "flex-end",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.red,
    paddingLeft: 5,
  },
  dropdownContainer: {
    borderRadius: 4,
  },
});
