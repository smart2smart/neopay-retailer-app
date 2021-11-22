import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    Image, TouchableOpacity, Alert
} from 'react-native';
import mapStateToProps from "../../store/mapStateToProps";
import {newCart, setIsLoggedIn} from "../../actions/actions";
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


function HomeScreen(props: any) {
    const navigation = useNavigation();
    const cart = useSelector((state: any) => state.cart);
    const distributor = useSelector((state: any) => state.distributor);
    const [data, setOrderData] = useState([]);


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
            console.log(e)
        }
    }

    const openPlayStoreLink = () => {
        VersionCheck.getLatestVersion().then(version => {
            let update_available = false;
            let version_list = version.split(".")
            let app_version = Constants.manifest.version.split(".");
            for (let i = 0; i < version_list.length; i++) {
                if (parseInt(version_list[i]) > parseInt(app_version[i])) {
                    update_available = true
                }
            }
            if (update_available) {
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

    const getProducts = (data) => {
        console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
    }

    useEffect(() => {
        checkForUpdates();
        PersistenceStore.getCart().then((data) => {
            if (data) {
                props.newCart(JSON.parse(data));
            }
        });
        getOrders();
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

    const setUp = async () => {
        if (!distributor) {
            let data = await PersistenceStore.getDistributor()
            if (data) {
                getProducts(JSON.parse(data));
            } else {
                navigation.navigate("SelectDistributor")
            }
        } else {
            getProducts(distributor);
        }
    }

    useEffect(() => {
        setUp()
    }, [distributor]);


    return (
        <View style={{flex: 1, paddingBottom: 20}}>
            <PrimaryHeader navigation={props.navigation}/>
            {distributor ? <View>
                <CompanyList distributor={distributor} />
            </View> : <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>
                    PLease select distributor
                </Text>
                <BorderButtonSmallBlue text={"Select Distributor"} ctaFunction={() => {
                    navigation.navigate("SelectDistributor")
                }}/>
            </View>}
            {cart.data.length > 0 ? <CartButton/> : null}
        </View>
    )
}

export default connect(mapStateToProps, {setIsLoggedIn, newCart})(HomeScreen);

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
    }
});
