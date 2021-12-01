import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    Image, TouchableOpacity, Alert, TextInput, ScrollView, RefreshControl
} from 'react-native';
import mapStateToProps from "../../store/mapStateToProps";
import {newCart, setDistributor} from "../../actions/actions";
// @ts-ignore
import {connect, useSelector} from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import {useNavigation} from "@react-navigation/native";
import CartButton from "../../commons/CartButton";
import PersistenceStore from "../../utils/PersistenceStore";
import VersionCheck from 'react-native-version-check-expo';
import * as Linking from 'expo-linking';
import * as Updates from 'expo-updates';
import Constants from "expo-constants";
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import {BorderButtonSmallBlue} from "../../buttons/Buttons";
import CompanyList from "./CompanyList";
import Indicator from "../../utils/Indicator";
import commonStyles from "../../styles/commonStyles";
import texts from "../../styles/texts";
import moment from "moment";
import RenderCarousel from "./Carousel";


function HomeScreen(props: any) {
    const navigation = useNavigation();
    const cart = useSelector((state: any) => state.cart);
    const [distributor, setDistributor] = useState(useSelector((state: any) => state.distributor));
    const [orderData, setOrderData] = useState([]);
    const [bannerData, setBannerData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    const checkForUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();
                Alert.alert(
                    "App Updated",
                    "App has been updated. Will restart now.",
                    [
                        {text: "OK", onPress: () => Updates.reloadAsync()}
                    ]
                );
            } else {
                openPlayStoreLink()
            }
        } catch (e) {

        }
    }

    const openPlayStoreLink = () => {
        VersionCheck.getLatestVersion().then(version => {
            let update_available = false;
            let playStoreVersion = version.split(".")
            let appVersion = Constants.manifest.version.split(".");
            if (parseInt(playStoreVersion[0]) > parseInt(appVersion[0])) {
                Alert.alert(
                    "Update App",
                    "Please update the app to proceed further.",
                    [
                        {
                            text: "OK",
                            onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.simplyfi.neopay')
                        }
                    ]
                );
            }
        })
    }

    useEffect(() => {
        checkForUpdates();
        PersistenceStore.getCart().then((data) => {
            if (data) {
                props.newCart(JSON.parse(data));
            }
        });
        getOrders();
        getBanners();
    }, [])

    const getOrders = () => {
        const data = {
            method: commonApi.getOrderList.method,
            url: commonApi.getOrderList.url,
            header: commonApi.getOrderList.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                let data = res.data.filter((item) => {
                    return item.status == "ordered" || item.status == "accepted"
                })
                setOrderData(data)
            } else {
                Alert.alert(res.data.error);
            }
        })
    }

    const getBanners = () => {
        const data = {
            method: commonApi.getBanners.method,
            url: commonApi.getBanners.url,
            header: commonApi.getBanners.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                setBannerData(res.data.results)
            } else {
                Alert.alert(res.data.error);
            }
        })
    }

    const getDistributorDetails = () => {
        const data = {
            method: commonApi.getDistributorDetails.method,
            url: commonApi.getDistributorDetails.url,
            header: commonApi.getDistributorDetails.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                if (res.data.length > 0) {
                    setDistributor(res.data[0]);
                    props.setDistributor(res.data[0])
                }
            } else {
                Alert.alert(res.data.error);
            }
        })
    }

    const setUp = async (distributor) => {
        if (!distributor) {
            let data = await PersistenceStore.getDistributor()
            if (data) {
                setDistributor(JSON.parse(data));
                props.setDistributor(JSON.parse(data))
            } else {
                getDistributorDetails();
            }
        }
        setIsLoading(false);
    }

    const onRefresh = ()=>{
        getOrders();
        getBanners();
        setUp(distributor);
    }

    useEffect(() => {
        setUp(distributor)
    }, [distributor]);

    const goToBuildOrder = () => {
        navigation.navigate("BuildOrder")
    }

    const goToOrderDetails = (data) => {
        navigation.navigate("OrderListDetails", {orderDetailsData: data})
    }

    const renderOrderCard = ({item}) => {
        return (<TouchableOpacity onPress={() => {
            goToOrderDetails(item)
        }} style={styles.orderCard}>
            <Text style={texts.darkGreyTextBold14}>
                {"Order Id: " + item.id}
            </Text>
            <Text style={texts.greyNormal12}>
                {item.products.length + " items"}
            </Text>
            <Text style={texts.greyNormal12}>
                {"Place on: " + moment(item.created_at).format("DD MMM, yyyy")}
            </Text>
            <View style={{flexDirection: 'row', alignItems: "center"}}>
                <Text style={texts.darkGreyTextBold12}>
                    {"Status : "}
                </Text>
                <Text style={texts.greenBold12}>
                    {item.status.toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>)
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <PrimaryHeader navigation={props.navigation}/>
            <ScrollView
                style={{flex: 1}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={[commonStyles.searchContainer, {marginVertical: 10, paddingHorizontal: 16}]}
                                  onPress={goToBuildOrder}>
                    <TextInput
                        value={""}
                        editable={false}
                        placeholder={"Search products, companies, brands..."}
                        onChangeText={(text) => {
                        }}
                        style={styles.textInput}>
                    </TextInput>
                </TouchableOpacity>
                {bannerData.length ? <RenderCarousel bannerData={bannerData}/> : null}
                {orderData.length > 0 ? <View style={{backgroundColor: colors.white}}>
                    <View style={[commonStyles.rowSpaceBetween, {paddingHorizontal: 16, paddingTop: 10}]}>
                        <View>
                            <Text style={texts.greyTextBold16}>
                                Order Tracking
                            </Text>
                        </View>
                        <View>
                            <BorderButtonSmallBlue text={"Create Order"} ctaFunction={goToBuildOrder}/>
                        </View>
                    </View>
                    <View style={{paddingVertical: 10, paddingRight: 16}}>
                        <FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={orderData}
                            renderItem={renderOrderCard}/>
                    </View>
                </View> : null}
                <View style={{flex: 1}}>
                    <CompanyList distributor={distributor}/>
                </View>
            </ScrollView>
            {cart.data.length > 0 ? <CartButton/> : null}
        </View>
    )
}

export default connect(mapStateToProps, {setDistributor, newCart})(HomeScreen);

const styles = StyleSheet.create({
    card: {
        height: 200,
        backgroundColor: colors.primary_color
    },
    statsCard: {
        backgroundColor: colors.white,
        height: 170,
        elevation: 5,
        borderRadius: 5,
        width: Dimensions.get("window").width - 48,
        position: "absolute",
        top: 124,
        left: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "space-between"
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        paddingBottom: 16
    },
    cardImage: {
        height: 50,
        width: 50,
        borderRadius: 10
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
        alignItems: 'center'
    },
    orderCard: {
        width: 240,
        height: 120,
        borderWidth: 1,
        borderColor: colors.light_grey,
        borderRadius: 5,
        marginLeft: 16,
        padding: 8,
        justifyContent: "space-between"
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.greyFaded,
        width: '100%',
        height: 36,
        paddingLeft: 10,
        borderRadius: 5
    },
});
