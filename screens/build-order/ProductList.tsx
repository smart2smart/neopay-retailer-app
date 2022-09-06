import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import colors from "@colors";
import commonStyles from "@commonStyles";
import texts from "@texts";
import AddToCartButton from "./AddToCartButton";

function ProductListNew({
  products,
  category1,
  category2,
  selectedCategory1,
  selectedCategory2,
  setSelectedCategory2,
  setCategory2,
  hideCategorySection = false,
}) {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {!hideCategorySection && (
        <ScrollView
          style={{
            width: "25%",
            backgroundColor: colors.light_pink,
          }}
        >
          {category2.map((item) => {
            return item.category_1_id !== selectedCategory1?.id ? null : (
              <TouchableOpacity
                key={item.id}
                style={[
                  item.id == selectedCategory2?.id
                    ? { backgroundColor: colors.red }
                    : null,
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  },
                ]}
                onPress={() => {
                  setSelectedCategory2(item);
                }}
              >
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 5,
                    backgroundColor: colors.white,
                  }}
                  resizeMode={"contain"}
                  source={{ uri: item.image }}
                />
                {/* <View
                  style={{
                    backgroundColor: "#9747FF",
                    width: 20,
                    height: 20,
                    borderRadius: 11,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: 5,
                    right: 9,
                  }}
                >
                  <Text style={texts.whiteTextBold12}>{item.count}</Text>
                </View> */}
                <Text
                  style={[
                    item.id == selectedCategory2?.id
                      ? texts.whiteTextBold12
                      : texts.blackTextBold12,
                    {
                      textAlign: "center",
                      marginTop: 4,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* product sku */}
      <ScrollView
        style={{
          width: "75%",
        }}
      >
        {products?.map((item) => {
          return (
            <View
              key={item.product_group_id}
              style={{
                padding: 10,
                marginBottom: 10,
                borderBottomColor: "#583d72",
                borderBottomWidth: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: "#aaa",
                    backgroundColor: colors.white,
                  }}
                  resizeMode={"contain"}
                  source={{ uri: item.image }}
                />
                <View
                  style={{
                    marginLeft: 10,
                  }}
                >
                  <Text style={texts.redTextBold14}>{item.brand_name}</Text>
                  <Text style={texts.blackTextBold14}>
                    {item.product_group_name}
                  </Text>
                  <Text style={[texts.greyTextBold14, { marginTop: "auto" }]}>
                    {item.data.length + " SKUs"}
                  </Text>
                  <Text style={texts.greyTextBold12}>{item.company_name}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "column" }}>
                {item.data.map((skuItem, skuIndex) => {
                  return (
                    <View
                      style={[
                        {
                          flexDirection: "row",
                          paddingVertical: 10,
                        },
                        {
                          borderTopColor: "#ddd",
                          borderTopWidth: 2,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "100%",
                        }}
                      >
                        <View
                          style={[
                            commonStyles.rowSpaceBetween,
                            {
                              alignItems: "flex-start",
                            },
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              width: "75%",
                              flexWrap: "wrap",
                            }}
                          >
                            <Text style={texts.greyTextBold16}>
                              {skuItem.variant}
                            </Text>
                            <Text style={texts.redTextBold16}>
                              {" > " + skuItem.sku}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={[texts.greenBold14, { fontWeight: "700" }]}
                            >
                              {skuItem.mrp + " Rs."}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            marginTop: 3,
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={[texts.blueBold12, { color: "#9747FF" }]}
                          >
                            {(
                              ((parseFloat(skuItem.mrp) -
                                parseFloat(skuItem.rate)) /
                                parseFloat(skuItem.rate)) *
                              100
                            ).toFixed(2) + " %"}
                          </Text>
                          {/* <Text style={[texts.darkGreyTextBold12]}>
                            {skuItem.rate + " Rs."}
                          </Text> */}
                        </View>
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              marginTop: "auto",
                              width: "60%",
                            }}
                          >
                            <Text style={[texts.greyTextBold12]}>
                              {skuItem.name}
                            </Text>
                            <Text
                              style={[
                                texts.darkGreyTextBold12,
                                {
                                  marginTop: 3,
                                },
                              ]}
                            >
                              {skuItem.distributor_name}
                            </Text>
                          </View>
                          <View style={{ width: "40%" }}>
                            <AddToCartButton
                              skuItemId={skuItem?.id}
                              skuItem={skuItem}
                              setCategory2={setCategory2}
                              hideCategorySection={hideCategorySection}
                            />
                          </View>
                        </View>
                        <View style={commonStyles.rowSpaceBetween}></View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
          //  : null;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});

export default ProductListNew;
