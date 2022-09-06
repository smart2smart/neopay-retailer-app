import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { commonApi } from "@api";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";
import Indicator from "@utils/Indicator";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import commonStyles from "@commonStyles";
import colors from "@colors";
import texts from "@texts";

import { setRetailerProducts } from "@actions";
import { BorderButtonBigBlue } from "@Buttons";
import ProfilePicture from "@commons/ProfilePicture";
import HomeSection from "./HomeSection";

function CompanyList(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [brandData, setBrandData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [category1, setCategory1] = useState([]);

  const getBeatPlanList = () => {
    const data = {
      method: commonApi.getBeatPlanList.method,
      url: commonApi.getBeatPlanList.url,
      header: commonApi.getBeatPlanList.header,
    };
    // @ts-ignore
    AuthenticatedGetRequest(data).then((res) => {
      if (res && res.status == 200) {
        let beatIds = [];
        res.data.forEach((item) => {
          beatIds.push(item.id);
        });
        getProductsData(beatIds);
      }
    });
  };

  useEffect(() => {
    getBeatPlanList();
  }, []);

  const getProductsData = (beatIds) => {
    try {
      const dataToSend = {
        method: commonApi.getProducts.method,
        url: commonApi.getProducts.url + "?beat_ids=" + JSON.stringify(beatIds),
        header: commonApi.getProducts.header,
      };
      // @ts-ignore
      AuthenticatedGetRequest(dataToSend).then((res) => {
        let data = res?.data || [];
        let productsData = { others: { data: [] } };
        let brands = {};
        let companies = {};
        let distributor = {};

        let category_1 = {};
        let category_2 = {};
        let all_products = {};

        data.forEach((item) => {
          if (!companies[item.company_id]) {
            companies[item.company_id] = {
              name: item["company_name"],
              id: item["company_id"],
              image: item["company_image"],
            };
          }

          if (!brands[item.brand_id]) {
            brands[item.brand_id] = {
              name: item["brand_name"],
              id: item["brand_id"],
              image: item["brand_image"],
              company_id: item["company_id"],
            };
          }

          if (!category_1[item.category_1_id] && item.category_1_id) {
            category_1[item.category_1_id] = {
              id: item.category_1_id,
              name: item.category_1_name,
              image: item.category_1_image,
              first_category_2: {
                id: item.category_2_id,
                name: item.category_2_name,
                image: item.category_2_image,
              },
              category_2: {
                [item.category_2_id]: {
                  id: item.category_2_id,
                  name: item.category_2_name,
                  image: item.category_2_image,
                },
              },
            };
          } else if (item.category_1_id) {
            if (
              category_1[item.category_1_id].first_category_2.id >
              item.category_2_id
            ) {
              category_1[item.category_1_id].first_category_2 = {
                id: item.category_2_id,
                name: item.category_2_name,
                image: item.category_2_image,
              };
            }
          }

          if (
            !category_2[item.category_2_id] &&
            item.category_1_id &&
            item.category_2_id
          ) {
            category_2[item.category_2_id] = {
              id: item.category_2_id,
              name: item.category_2_name,
              image: item.category_2_image,
              category_1_id: item.category_1_id,
              count: 0,
            };
          }

          //   distributor[item.distributor_id] = {
          //     distributor_id: item.distributor_id,
          //     distributor_name: item.distributor_name,
          //   };

          if (item?.product_group_id) {
            if (productsData[item.product_group_id]) {
              productsData[item.product_group_id]?.data?.push({
                ...item,
              });
            } else {
              productsData[item.product_group_id] = {
                company_name: item["company_name"],
                company_id: item["company_id"],
                brand_id: item["brand_id"],
                brand_name: item["brand_name"],
                image: item["product_group_image"],
                product_group_name: item["product_group"],
                product_group_id: item["product_group_id"],
                data: [item],
              };
            }
          }
          all_products[item.id] = item;
        });
        setCompanyData(Object.values(companies));
        setBrandData(Object.values(brands));
        setCategory1(Object.values(category_1));
        setIsLoading(false);
        dispatch(
          setRetailerProducts({
            products: Object.values(productsData),
            category_1: Object.values(category_1),
            category_2: Object.values(category_2),
            companies: companies,
            brands: brands,
            all_products: all_products,
          })
        );
      });
    } catch (err) {}
  };

  const goToBuildOrder = () => {
    navigation.navigate("BuildOrder");
  };

  return (
    <View style={{ flex: 1, minHeight: 200 }}>
      <Indicator isLoading={isLoading} />
      {!isLoading ? (
        <View style={styles.container}>
          <HomeSection
            title={"Categories"}
            data={category1}
            onClick={(item) => {
              navigation.navigate("BuildOrder", {
                category1: item,
              });
            }}
          />
          <HomeSection
            title={"Companies"}
            data={companyData}
            onClick={(item) => {
              navigation.navigate("search-sku", { searchText: item.name });
            }}
          />
          <HomeSection
            title={"Brands"}
            data={brandData}
            onClick={(item) => {
              navigation.navigate("search-sku", { searchText: item.name });
            }}
          />
          <View style={{ marginTop: 20, marginBottom: 100 }}>
            <BorderButtonBigBlue
              ctaFunction={goToBuildOrder}
              text={"All Products"}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    position: "relative",
    flex: 1,
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  companyCard: {
    height: 100,
    width: "30%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.light_grey,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryCard: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.light_grey,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  companyHeader: {
    paddingTop: 7,
    paddingBottom: 7,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#aaa",
    borderBottomColor: "#aaa",
  },
});

export default CompanyList;
