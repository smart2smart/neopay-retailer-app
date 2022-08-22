import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  RefreshControl,
  LogBox,
  Button,
} from "react-native";
import mapStateToProps from "../../store/mapStateToProps";
import { newCart } from "../../actions/actions";
// @ts-ignore
import { connect, useSelector } from "react-redux";
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PersistenceStore from "../../utils/PersistenceStore";
import { commonApi } from "../../api/api";
import { AuthenticatedGetRequest } from "../../api/authenticatedGetRequest";
import { BorderButtonSmallBlue } from "../../buttons/Buttons";
import CompanyList from "./CompanyList";
import commonStyles from "../../styles/commonStyles";
import texts from "../../styles/texts";
import moment from "moment";
import RenderCarousel from "./Carousel";
import { PostRequest } from "../../api/postRequest";
import Icon from "react-native-vector-icons/Feather";
import CartButton from "../build-order/CartButton";
import AddToCartButton from "../build-order/AddToCartButton";

function HomeScreen(props: any) {
  const navigation = useNavigation();
  const expoToken = useSelector((state: any) => state.expoToken);
  const { all_products } = useSelector((state: any) => state.product || {});

  const cart = useSelector((state: any) => state.cart);

  const [orderData, setOrderData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBanners();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getOrders(true);
    }, [])
  );

  const getOrders = (refreshing: boolean) => {
    const data = {
      method: commonApi.getOrderList.method,
      url: commonApi.getOrderList.url + "?limit=10&offset=0",
      header: commonApi.getOrderList.header,
    };
    refreshing ? setRefreshing(true) : setIsLoading(true);
    // @ts-ignore
    AuthenticatedGetRequest(data).then((res) => {
      setIsLoading(false);
      setRefreshing(false);
      if (res.status == 200) {
        let data = res.data.results.filter((item) => {
          return item.status == "ordered" || item.status == "accepted";
        });
        setOrderData(data);
      } else {
        res?.data?.error && Alert.alert(res.data.error);
      }
    });
  };

  const getBanners = () => {
    const data = {
      method: commonApi.getBanners.method,
      url: commonApi.getBanners.url,
      header: commonApi.getBanners.header,
    };
    // @ts-ignore
    AuthenticatedGetRequest(data).then((res) => {
      if (res.status == 200) {
        setBannerData(res.data.results);
      } else {
        Alert.alert(res.data.error);
      }
    });
  };

  const onRefresh = () => {
    getOrders(true);
    getBanners(true);
  };

  const goToBuildOrder = () => {
    navigation.navigate("BuildOrder");
  };

  const goToOrderDetails = (data) => {
    navigation.navigate("OrderListDetails", { orderDetailsData: data });
  };

  const renderOrderCard = ({ item }) => {
    let totalMrp = 0;
    let buyRate = 0;
    item.product_list.forEach((skuItem) => {
      totalMrp += skuItem.mrp;
      buyRate += skuItem.rate;
    });
    let profit = (((totalMrp - buyRate) / totalMrp) * 100).toFixed(2);
    return (
      <TouchableOpacity
        onPress={() => {
          goToOrderDetails(item);
        }}
        style={styles.orderCard}
      >
        <View style={{ flexDirection: "row", padding: 5 }}>
          <View>
            <View
              style={{
                backgroundColor: "#ddd",
                padding: 8,
                margin: 5,
                borderRadius: 8,
              }}
            >
              <Text style={texts.greyTextBold12}>{"Avg. Profit"}</Text>
              <Text style={[texts.blackTextBold18, { fontSize: 24 }]}>
                {profit + "%"}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#ddd",
                padding: 8,
                margin: 5,
                borderRadius: 8,
              }}
            >
              <Text style={texts.greyTextBold14}>
                {moment(item.created_at).format("DD - MMM")}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                padding: 8,
              }}
            >
              <Text style={[texts.greyTextBold12, { fontSize: 10 }]}>
                {"Status : "}
              </Text>
              <Text style={texts.greenBold12}>
                {item.status[0].toUpperCase() + item.status.slice(1)}
              </Text>
              <Text style={[texts.blackTextBold16, { marginTop: "auto" }]}>
                {"Rs. " + item.order_value}
              </Text>
            </View>

            <View
              style={{
                padding: 8,
                margin: 5,
                borderRadius: 8,
                marginTop: "auto",
                flexDirection: "row",
              }}
            >
              <Text style={texts.blackTextBold14}>
                {item.product_list.length + " SKUs"}
              </Text>
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <Icon name="shopping-cart" size={14} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProductCard = ({ item }) => {
    return all_products && all_products[item.id] ? (
      <View
        style={[styles.orderCard, { width: 150 }]}
        key={all_products[item.id].id}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: "#ddd",
            borderRadius: 10,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 5,
              backgroundColor: colors.white,
            }}
            resizeMode={"contain"}
            source={{ uri: all_products[item.id].product_group_image }}
          />
        </View>
        <Text style={[texts.blackTextBold14, { marginBottom: 5 }]}>
          {all_products[item.id].product_group}
        </Text>
        <AddToCartButton
          showMrp={true}
          skuItem={all_products[item.id]}
          hideCategorySection={true}
          skuItemId={all_products[item.id].id}
        />
      </View>
    ) : null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <PrimaryHeader navigation={props.navigation} />
      {!isLoading ? (
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* search bar */}
          <TouchableOpacity
            style={[
              commonStyles.searchContainer,
              { marginVertical: 10, paddingHorizontal: 16 },
            ]}
            onPress={goToBuildOrder}
          >
            <TextInput
              value={""}
              editable={false}
              placeholder={"Search products, companies, brands..."}
              onChangeText={(text) => {}}
              style={styles.textInput}
            ></TextInput>
          </TouchableOpacity>

          {/* banner */}
          {bannerData.length ? (
            <RenderCarousel bannerData={bannerData} />
          ) : null}

          {orderData.length ? (
            <>
              <SectionHeader title={"Your Most Ordered"} />
              <View style={{ paddingVertical: 10, paddingRight: 16 }}>
                <FlatList
                  keyExtractor={(item, index) => item.id + "" + index}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={orderData[0]?.product_list}
                  renderItem={renderProductCard}
                />
              </View>
            </>
          ) : null}

          {/* your last order */}
          {orderData.length > 0 ? (
            <View style={{ backgroundColor: colors.white }}>
              <SectionHeader title={"Your Previous Order"} />
              <View style={{ paddingVertical: 10, paddingRight: 16 }}>
                <FlatList
                  keyExtractor={(item, index) => item.id + "" + index}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={orderData}
                  renderItem={renderOrderCard}
                />
              </View>
            </View>
          ) : null}

          <View style={{ flex: 1 }}>
            <CompanyList />
          </View>
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Please Wait,</Text>
          <Text> Company, Brand and Category is loading!</Text>
        </View>
      )}

      <CartButton />
    </View>
  );
}

export default connect(mapStateToProps, { newCart })(HomeScreen);

const SectionHeader = ({ title }) => {
  return (
    <View
      style={[
        commonStyles.rowCenter,
        { padding: 10 },
        {
          backgroundColor: "#ddd",
        },
      ]}
    >
      <View>
        <Text style={[texts.darkGreyTextBold16, { fontSize: 18 }]}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    backgroundColor: colors.primary_color,
  },
  statsCard: {
    backgroundColor: colors.white,
    height: 170,
    elevation: 5,
    borderRadius: 5,
    width: Dimensions.get("window").width - 48,
    position: "absolute",
    top: 124,
    left: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingBottom: 16,
  },
  cardImage: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  distributorCard: {
    borderRadius: 5,
    paddingVertical: 5,
    marginTop: 12,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.grey,
    flexDirection: "row",
    alignItems: "center",
  },
  orderCard: {
    width: 240,
    borderWidth: 1,
    borderColor: colors.light_grey,
    borderRadius: 5,
    marginLeft: 10,
    padding: 8,
    justifyContent: "space-between",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.greyFaded,
    width: "100%",
    height: 36,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
