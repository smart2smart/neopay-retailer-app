import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import colors from "@colors";
import commonStyles from "@commonStyles";
import SecondaryHeader from "@headers/SecondaryHeader";
import Indicator from "@utils/Indicator";
import AddToCartButton from "./AddToCartButton";
import texts from "@texts";
import CartButton from "./CartButton";
// import BarCodeScan from "@commons/BarCode";

var time = null;
const SearchScreen = (props) => {
  const route = useRoute();
  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [barcodeScan, setBarcodeScan] = useState(false);

  const {
    products: productsData,
    category_1,
    category_2,
  } = useSelector(
    (state: any) =>
      state.product || {
        products: [],
        category_1: [],
        category_2: [],
      }
  );

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (route.params?.searchText) {
      searchProducts({ ean_code: "", text: route.params?.searchText });
    }
  }, []);

  const searchProducts = ({
    text,
    ean_code,
  }: {
    text: string;
    ean_code: string;
  }) => {
    try {
      if (ean_code) {
        setSearchText(ean_code);
      } else setSearchText(text);
      if (time) {
        clearTimeout(time);
      }

      time = setTimeout(() => {
        if (text === "" && ean_code === "") {
          setProducts(productsData);
        } else {
          let filteredData = productsData.map((item: any) => {
            return {
              ...item,
              data: item.data.filter((itm) => {
                if (
                  ean_code &&
                  itm.ean_code.toString() === ean_code.toString()
                ) {
                  return true;
                } else if (text) {
                  return (
                    itm.name.toLowerCase().includes(text.toLowerCase()) ||
                    (itm.brand_name &&
                      itm.brand_name
                        .toLowerCase()
                        .includes(text.toLowerCase())) ||
                    (itm.company_name &&
                      itm.company_name
                        .toLowerCase()
                        .includes(text.toLowerCase())) ||
                    (itm.product_group &&
                      itm.product_group
                        .toLowerCase()
                        .includes(text.toLowerCase())) ||
                    (itm.category_1_name &&
                      itm.category_1_name
                        .toLowerCase()
                        .includes(text.toLowerCase())) ||
                    (itm.category_2_name &&
                      itm.category_2_name
                        .toLowerCase()
                        .includes(text.toLowerCase())) ||
                    (itm.category_3_name &&
                      itm.category_3_name
                        .toLowerCase()
                        .includes(text.toLowerCase())) ||
                    (itm.variant &&
                      itm.variant.toLowerCase().includes(text.toLowerCase()))
                  );
                } else false;
              }),
            };
          });
          let removeBoolean = filteredData.filter((item) => {
            return item.data.length > 0;
          });
          setProducts(removeBoolean);
        }
      }, 500);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBarCodeData = (data: any) => {
    if (!data.backPress) searchProducts({ ean_code: data.data, text: "" });
    setBarcodeScan(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Indicator isLoading={isLoading} />

      {/* {barcodeScan && <BarCodeScan barCodeData={handleBarCodeData} />} */}

      <View style={styles.container}>
        <View
          style={{
            paddingHorizontal: 10,
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          <SecondaryHeader title={"Search Products"} />
        </View>
        <View
          style={[commonStyles.searchContainer, { margin: 10, marginTop: 0 }]}
        >
          <TextInput
            value={searchText}
            placeholder={"Search Product, Category, SKUs, etc."}
            onChangeText={(text) => searchProducts({ text })}
            style={commonStyles.textInput}
          ></TextInput>
          {searchText !== "" ? (
            <TouchableOpacity
              onPress={() => searchProducts({ text: "", ean_code: "" })}
              style={{ position: "absolute", right: 0, padding: 40 }}
            >
              <AntDesign name="close" size={18} color={colors.black} />
            </TouchableOpacity>
          ) : null}
          {/* <TouchableOpacity
            onPress={() => setBarcodeScan(true)}
            style={{ position: "absolute", right: 0, padding: 10 }}
          >
            <MaterialCommunityIcons
              name="barcode-scan"
              size={22}
              color={colors.grey}
            />
          </TouchableOpacity> */}
        </View>

        <ScrollView>
          {products.map((item) =>
            item.data.map((skuItem) => (
              <SearchProductCard
                skuItem={skuItem}
                route={route}
                product_group_name={item.product_group_name}
              />
            ))
          )}
        </ScrollView>
      </View>
      <CartButton />
    </View>
  );
};

const SearchProductCard = ({ skuItem, route, product_group_name }) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 20,
      }}
    >
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
          <Text style={texts.darkGreyTextBold14}>
            {skuItem.brand_name + " > " + product_group_name}
          </Text>
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
              <Text style={texts.greyTextBold16}>{skuItem.variant}</Text>
              <Text style={texts.redTextBold16}>{" > " + skuItem.sku}</Text>
            </View>
            <View>
              <Text style={[texts.greenBold14, { fontWeight: "700" }]}>
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
            <Text style={[texts.blueBold12, { color: "#9747FF" }]}>
              {(
                ((parseFloat(skuItem.mrp) - parseFloat(skuItem.rate)) /
                  parseFloat(skuItem.rate)) *
                100
              ).toFixed(2) + " %"}
            </Text>
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
                width: "70%",
              }}
            >
              <Text style={[texts.greyTextBold12]}>{skuItem.name}</Text>
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
            <View>
              <AddToCartButton
                skuItemId={skuItem?.id}
                skuItem={skuItem}
                retailerData={route?.params?.retailerData}
                hideCategorySection={true}
              />
            </View>
          </View>
          <View style={commonStyles.rowSpaceBetween}></View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
});
