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
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import texts from "../../styles/texts";
import CartButton from "../../commons/CartButton";
import PersistenceStore from "../../utils/PersistenceStore";
import * as Updates from 'expo-updates';
import VersionCheck from 'react-native-version-check-expo'
import * as Linking from 'expo-linking';
import Constants from "expo-constants";
import {useFocusEffect} from '@react-navigation/native';


function HomeScreen(props: any) {
    const navigation = useNavigation();
    const cart = useSelector((state: any) => state.cart);
    const [distributorData, setDistributorData] = useState([]);
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
            console.log(e)
        }
    }

    const openPlayStoreLink = () => {
        VersionCheck.getLatestVersion().then(version => {
            if (version[0] > Constants.manifest.version[0]) {
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
        getDistributorDetails();
        PersistenceStore.getCart().then((data) => {
            if (data) {
                props.newCart(JSON.parse(data));
            }
        })
    }, []);

    const getDistributorDetails = () => {
        const data = {
            method: commonApi.getDistributorDetails.method,
            url: commonApi.getDistributorDetails.url,
            header: commonApi.getDistributorDetails.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                setDistributorData(res.data);
            } else {
                Alert.alert(res.data.error);
            }
        })
    }


    const goToDistributorProducts = (distributorId) => {
        navigation.navigate("ProductList", {distributorId: distributorId})
    }

    const distributorDescription = ({item}) => {
        return (
            <TouchableOpacity onPress={() => {
                goToDistributorProducts(item.user)
            }} style={[styles.distributorCard]}>
                <Image resizeMode={"contain"} style={styles.cardImage}
                       source={item.profile_picture ? {uri: item.profile_picture} : require("../../assets/images/placeholder_profile_pic.jpg")}/>
                <View style={{paddingLeft: 12}}>
                    <Text style={texts.greyTextBold14}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{flex: 1, paddingBottom: 20}}>
            <PrimaryHeader navigation={props.navigation}/>
            <FlatList
                onRefresh={() => {
                    getDistributorDetails()
                }}
                refreshing={refreshing}
                data={distributorData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.user + ""}
                renderItem={distributorDescription}
                ListFooterComponent={<View style={{paddingBottom: 100}}></View>}
            />
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
