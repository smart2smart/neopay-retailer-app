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
  let timeOut = null;
  const flatListRef = React.useRef();
  const [flatListIndex, setFlatListIndex] = React.useState(1);

  React.useEffect(() => {
    try {
      if (
        flatListIndex >= 0 &&
        products?.length &&
        flatListRef.current?._wrapperListRef?._listRef?._averageCellLength > 0
      ) {
        flatListRef?.current?.scrollToLocation({
          itemIndex: flatListIndex === 0 ? 1 : flatListIndex,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [flatListIndex]);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {!hideCategorySection && (
        <ScrollView
          style={{
            width: "25%",
            backgroundColor: "#58397410",
          }}
        >
          {category2.map((item) => {
            return item.category_1_id !== selectedCategory1?.id ? null : (
              <TouchableOpacity
                key={item.id}
                style={[
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setSelectedCategory2(item);

                  let ind = products.findIndex(
                    (sku) => sku.category_2_id === item.id
                  );

                  let skuItem = products
                    .slice(0, ind)
                    .reduce((acc, cur) => (acc += cur.data.length + 2), 0);
                  setFlatListIndex(skuItem);
                }}
              >
                <Image
                  style={[
                    {
                      width: item.id == selectedCategory2?.id ? 60 : 55,
                      height: item.id == selectedCategory2?.id ? 60 : 55,
                      borderRadius: 5,
                      backgroundColor: colors.white,
                    },
                    item.id == selectedCategory2?.id
                      ? { borderWidth: 2, borderColor: colors.red }
                      : null,
                  ]}
                  resizeMode={"contain"}
                  source={{ uri: item.image }}
                />
                <Text
                  style={[
                    item.id == selectedCategory2?.id
                      ? texts.redTextBold12
                      : texts.darkGreyTextBold12,
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
