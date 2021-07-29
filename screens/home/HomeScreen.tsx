import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
} from 'react-native';
import mapStateToProps from "../../store/mapStateToProps";
import {setIsLoggedIn} from "../../actions/actions";
// @ts-ignore
import {connect, useSelector} from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import {BorderButtonBigRed} from '../../buttons/Buttons';
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../../styles/commonStyles';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import texts from "../../styles/texts";

export function HomeScreen(props: any) {
    const navigation = useNavigation();
    const [distributorData, setDistributorData] = useState([]);

    useEffect(() => {
        getDistributorDetails();
    }, []);

    const getDistributorDetails = () => {
        const data = {
            method: commonApi.getDistributorDetails.method,
            url: commonApi.getDistributorDetails.url,
            header: commonApi.getDistributorDetails.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            console.log('#############', res);
            setDistributorData(res.data);
        })
    }

    const createOrder = (distributorID) => {
        navigation.navigate("CreateOrder", {distributorID})
        // console.log("distrivutorID", distributorID);
    };

    const storeDetails = () => {
        navigation.navigate("StoreDetails")
    };

    const distributorDescription = ({item}) => {
        return (
            <View style={{borderRadius: 5,
                paddingVertical:5,
                marginTop:12,
                paddingHorizontal:12,
                marginHorizontal:12,
                borderWidth: 1, borderColor: colors.grey, flexDirection:"row", alignItems:'center'}}>
                <Image resizeMode={"contain"} style={styles.cardImage}
                       source={item.profile_picture?{uri: item.profile_picture}:require("../../assets/images/placeholder_profile_pic.jpg")}/>
                <View style={{paddingLeft:12}}>
                    <Text style={texts.greyTextBold14}>
                        {item.name}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{flex: 1, paddingBottom:20}}>
            <PrimaryHeader navigation={props.navigation}/>
            <FlatList
                data={distributorData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.user + ""}
                renderItem={distributorDescription}
            />
        </View>
    )
}

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
        borderRadius:10
    }
});

export default connect(mapStateToProps, {setIsLoggedIn})(HomeScreen);
