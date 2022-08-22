import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import Indicator from "../../utils/Indicator";
import SecondaryHeader from "../../headers/SecondaryHeader";
import mapStateToProps from "../../store/mapStateToProps";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";

import { commonApi } from "../../api/api";
import { AuthenticatedGetRequest } from "../../api/authenticatedGetRequest";
import { setProductsNew, updateProductsNew } from "../../actions/actions";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";

import AddToCartButton from "./AddToCartButton";
import CartButton from "./CartButton";

import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialIcons";
import ProductList from "./ProductList";
import Category1 from "./Category1";

function BuildOrder(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [selectedCategory1, setSelectedCategory1] = useState(null);
  const [selectedCategory2, setSelectedCategory2] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(false);

  const { products, category_1, category_2 } = useSelector(
    (state: any) =>
      state.product || {
        products: [],
        category_1: [],
        category_2: [],
      }
  );

  useEffect(() => {
    try {
      if (route.params?.category1) {
        setSelectedCategory1(route.params.category1);
        setSelectedCategory2(route.params.category1.first_category_2);
      } else if (category_1.length) {
        setSelectedCategory1(category_1[0]);
        setSelectedCategory2(category_1[0].first_category_2);
      }
      setIsLoading(false);
    } catch (err) {
      console.log("@err>>", err);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory1?.id) {
      setSelectedCategory2(selectedCategory1?.first_category_2);
      setIsProductLoading(false);
    }
  }, [selectedCategory1?.id]);

  const applyProductFilters = (filters) => {
    let filteredData;
    if (filters.margin) {
      filteredData = productsData.map((item: any) => {
        return {
          ...item,
          data: item?.data?.filter((product: any) => {
            let productMargin =
              ((parseFloat(product.mrp) - parseFloat(product.rate)) /
                parseFloat(product.rate)) *
              100;
            return (
              productMargin >= filters.margin.from &&
              productMargin <= filters.margin.to
            );
          }),
        };
      });
    } else {
      filteredData = productsData;
    }
    let removeBoolean = filteredData.filter((item) => {
      return item.data.length > 0;
    });
    setProducts(removeBoolean);
  };

  return (
    <View style={{ flex: 1 }}>
      <Indicator isLoading={isLoading} />
      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          <SecondaryHeader
            title={
              route.params?.comingFrom == "edit"
                ? "Edit Order "
                : "Build Order "
            }
            headerRightItem={
              <View style={styles.rowAlignCenter}>
                <TouchableOpacity
                  style={{ marginHorizontal: 10 }}
                  onPress={() => {
                    navigation.navigate("search-sku");
                  }}
                >
                  <Icon name="search" size={24} color={colors.grey} />
                </TouchableOpacity>
              </View>
            }
          />
        </View>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={texts.darkGreyNormal14}>
              Please Wait, Product is loading!!
            </Text>
          </View>
        ) : (
          <>
            {/* category_1 */}
            <View>
              <Category1
                categoryList={category_1}
                selectedCategory={selectedCategory1}
                setSelectedCategory={(item) => {
                  setSelectedCategory1(item);
                  setIsProductLoading(true);
                }}
              />
            </View>

            {isProductLoading ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Indicator isLoading={isProductLoading} />
                <Text style={[texts.greyTextBold14, { marginTop: 60 }]}>
                  {"Please Wait"}
                </Text>
                <Text style={[texts.greyTextBold14]}>
                  {selectedCategory1.name + " is Loading!!"}{" "}
                </Text>
              </View>
            ) : (
              <ProductList
                name="build"
                products={products?.filter((item) =>
                  item.data.some(
                    (skuItem) => skuItem.category_2_id === selectedCategory2?.id
                  )
                )}
                category2={category_2}
                selectedCategory1={selectedCategory1}
                setSelectedCategory2={setSelectedCategory2}
                selectedCategory2={selectedCategory2}
                category1={category_1}
              />
            )}

            <CartButton />
          </>
        )}
      </View>
    </View>
  );
}

export default BuildOrder;
const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  rowAlignCenter: {
    flexDirection: "row",
    padding: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 5,
    borderColor: colors.grey,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  callIconDiv: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderColor: colors.red,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  callIcon: {
    width: 15,
    height: 15,
  },
  productHeader: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    paddingBottom: 10,
  },
  recommendationsButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    height: 30,
    width: 230,
    justifyContent: "space-between",
  },
  recommendationsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  tabButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  defaultTabButton: {
    borderRadius: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  itemsCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 3,
    alignItems: "center",
  },
  filterBox: {
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: colors.white,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterCount: {
    width: "auto",
    textDecorationColor: "white",
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: colors.blue,
    color: "white",
    paddingLeft: 3,
    paddingRight: 3,
  },
  collapsableButton: {
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 1,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    marginRight: 6,
  },
});

export default connect(mapStateToProps, {})(BuildOrder);
