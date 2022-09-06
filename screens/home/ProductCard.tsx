import React, { memo } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import texts from "@texts";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "@colors";
import commonStyles from "@commonStyles";
import AddProductButton from "./AddProductButton";
import { Dropdown } from "react-native-element-dropdown";

const screenHeight = Dimensions.get("window").height;
let dropdownPadding = screenHeight * 0.035;

const RenderItem = (props) => {
  const get_current_rate = (entity, quantity, lot_quantity) => {
    let min_qty = 0;
    let current_rate = entity.rate;
    let least_rate = entity.rate;
    if (entity?.qps?.length > 0) {
      entity.qps.forEach((qps) => {
        if (qps.min_qty * lot_quantity >= min_qty) {
          least_rate = parseFloat(
            parseFloat(entity.rate) * (1 - qps.discount_rate / 100)
          ).toFixed(2);
        }
        if (quantity * lot_quantity >= qps.min_qty) {
          current_rate = parseFloat(
            parseFloat(entity.rate) * (1 - qps.discount_rate / 100)
          ).toFixed(2);
        }
      });
    }
    return { current_rate, least_rate };
  };

  return (
    <View>
      <View style={styles.underline}>
        {props.item.product_group_id ? (
          <Text style={texts.darkGreyTextBold14}>
            {props.item.company_name}
          </Text>
        ) : (
          <View style={commonStyles.rowSpaceBetween}>
            <Text style={texts.darkGreyTextBold14}>Others</Text>
            <View>
              <TouchableOpacity
                style={styles.collapsableButton}
                onPress={() => {
                  props.handleCollapse(props.index);
                }}
              >
                <Icon
                  name={props.item.collapsed ? "down" : "up"}
                  size={18}
                  color={colors.red}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View style={[commonStyles.rowSpaceBetween, { width: "100%" }]}>
        <View style={{ width: "86%" }}>
          {props.item.product_group_id ? (
            <TouchableOpacity
              onPress={() => {
                props.expandProductGroupImage(props.index);
              }}
              style={[commonStyles.rowAlignCenter, { paddingVertical: 6 }]}
            >
              {!props.item.pg_image_expanded ? (
                <View style={{ marginRight: 6 }}>
                  <Image
                    style={styles.productImage}
                    source={
                      props.item.image
                        ? { uri: props.item.image }
                        : require("../../assets/images/placeholder_profile_pic.jpg")
                    }
                  />
                </View>
              ) : null}
              <View style={{ width: "86%" }}>
                <Text style={[texts.greyNormal14, { paddingBottom: 5 }]}>
                  {props.item.company_name} {">"} {props.item.brand_name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "86%",
                  }}
                >
                  <Text style={texts.redTextBold12}>
                    {props.item.product_group_name}
                  </Text>
                  <Text style={texts.blackTextBold12}>
                    {props.item.data.length + " SKUs"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
          {props.item.pg_image_expanded ? (
            <TouchableOpacity
              onPress={() => {
                props.expandProductGroupImage(props.index);
              }}
            >
              <Image
                style={{ width: "100%", height: 200, borderRadius: 5 }}
                source={
                  props.item.image
                    ? { uri: props.item.image }
                    : require("../../assets/images/placeholder_profile_pic.jpg")
                }
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {props.item.product_group_id ? (
          <View>
            <TouchableOpacity
              style={styles.collapsableButton}
              onPress={() => {
                props.handleCollapse(props.index);
              }}
            >
              <Icon
                name={props.item.collapsed ? "down" : "up"}
                size={18}
                color={colors.red}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {!props.item.collapsed ? (
        <View>
          {props.item.data.map((entity, subIndex) => {
            let { current_rate, least_rate } = get_current_rate(
              entity,
              entity.quantity,
              entity.lot_quantity
            );
            let margin = ((entity.mrp - current_rate) / current_rate) * 100;
            return (
              <View
                key={entity.id + subIndex + "" + entity.name}
                style={styles.underline}
              >
                {entity.image_expanded ? (
                  <TouchableOpacity
                    onPress={() => {
                      props.expandImage(props.index, subIndex);
                    }}
                  >
                    <Image
                      style={{ width: "100%", height: 200, borderRadius: 5 }}
                      source={
                        entity.sku_image
                          ? { uri: entity.sku_image }
                          : require("../../assets/images/placeholder_profile_pic.jpg")
                      }
                    />
                  </TouchableOpacity>
                ) : null}
                <View style={commonStyles.rowSpaceBetween}>
                  <View style={{ width: "70%" }}>
                    <View>
                      <Text style={[texts.greyNormal12, { paddingTop: 5 }]}>
                        {entity.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        paddingVertical: 4,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={texts.darkGreyTextBold12}>
                        {entity.product_group_id ? entity.variant : entity.name}
                      </Text>
                      {entity.product_group_id ? (
                        <Text style={texts.redTextBold12}>
                          {" > " + entity.sku}
                        </Text>
                      ) : null}
                    </Text>
                    <View style={commonStyles.rowAlignCenter}>
                      <View style={commonStyles.row}>
                        <Text style={texts.greyTextBold12}>MRP:</Text>
                        <Text style={texts.greyTextBold12}>
                          {" " + entity.mrp}
                        </Text>
                      </View>
                      <View style={[commonStyles.row, { marginLeft: 10 }]}>
                        <Text style={texts.greyTextBold12}>Rate:</Text>
                        <Text style={texts.greyTextBold12}>
                          {" " +
                            parseFloat(
                              parseFloat(current_rate) * entity.lot_quantity
                            ).toFixed(2)}
                        </Text>
                      </View>
                      <View style={[commonStyles.row, { marginLeft: 10 }]}>
                        {margin > 0 ? (
                          <View style={commonStyles.rowAlignCenter}>
                            <Text style={texts.greyTextBold12}>Margin:</Text>
                            <Text style={texts.greenBold12}>
                              {" " + margin.toFixed(1) + "%"}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <Text style={texts.greyBold12}>Seller: {entity.distributor_name}</Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    {!entity.image_expanded ? (
                      <TouchableOpacity
                        onPress={() => {
                          props.expandImage(props.index, subIndex);
                        }}
                      >
                        {entity.sku_image ? (
                          <Image
                            style={{ width: 50, height: 50 }}
                            resizeMode={"contain"}
                            source={{ uri: entity.sku_image }}
                          />
                        ) : null}
                      </TouchableOpacity>
                    ) : null}
                    <View>
                      <AddProductButton
                        item={entity}
                        mainIndex={props.index}
                        subIndex={subIndex}
                        setProductQuantity={props.setProductQuantity}
                        selectProduct={props.selectProductAlert}
                      />
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                      {entity.unit_conversion &&
                      (entity.level_1_enabled || entity.level_2_enabled) ? (
                        <View style={{ width: 80 }}>
                          <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            maxHeight={36 * entity.lot_size_data.length}
                            selectedTextStyle={texts.redTextNormal10}
                            renderItem={(unit) => {
                              return (
                                <View
                                  style={{
                                    height: 36,
                                    paddingLeft: 10,
                                    justifyContent: "center",
                                    backgroundColor:
                                      entity.selected_unit == unit.value
                                        ? colors.light_grey
                                        : colors.white,
                                    borderBottomColor: colors.light_grey,
                                    borderBottomWidth: 1,
                                  }}
                                >
                                  <Text
                                    style={
                                      entity.selected_unit == unit.value
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
                            data={entity.lot_size_data}
                            labelField="label"
                            valueField="value"
                            value={entity.selected_unit}
                            placeholder="Select item"
                            onChange={(unit) => {
                              props.selectUnitDropdown(
                                props.index,
                                subIndex,
                                unit.value,
                                unit.quantity,
                                unit.label
                              );
                            }}
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
                {entity.qps.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      let data = [...props.item.data];
                      let filteredData = data.filter((product) => {
                        return product.id == entity.id;
                      });
                      let current = { ...props.item };
                      current.data = filteredData;
                      props.setQPSData(current);
                      props.setQPSModalVisible(true);
                    }}
                  >
                    <View style={styles.qpsDiv}>
                      <Text style={texts.redTextBold10}>
                        {`Bulk offer upto Rs. ${least_rate}/pc >`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export default memo(RenderItem);

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    paddingBottom: 5,
  },
  collapsableButton: {
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 1,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    marginRight: 6,
    width: 25,
  },
  dropdown: {
    backgroundColor: "white",
    marginTop: 4,
    borderRadius: 4,
    height: 20,
    width: 80,
    alignSelf: "flex-end",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.red,
    paddingLeft: 5,
  },
  dropdownContainer: {
    borderRadius: 4,
    marginTop: -dropdownPadding,
  },
  qpsDiv: {
    marginTop: 8,
    backgroundColor: "rgba(169, 41, 79, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  productImage: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 5,
  },
});
