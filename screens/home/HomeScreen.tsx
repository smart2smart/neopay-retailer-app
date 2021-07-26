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

export function HomeScreen(props: any) {

    const mockData = {
        id: 534,
        name: "Vikram stores",
        distributors: [
            {
                pk: 1475,
                name: "Subodh Trading",
                profile_picture: null
            },
            {
                pk: 1461,
                name: "Anannya1",
                profile_picture: null
            },
            {
                pk: 1480,
                name: "Gloify_Distributor",
                profile_picture: null
            },
        ],
    };

    const navigation = useNavigation();
    const [distributorData, setDistributorData] = useState([]);

    useEffect(() => {

    }, []);



    const createOrder = (distributorID) => {
        navigation.navigate("CreateOrder", {distributorID})
    };

    const storeDetails = () => {
        navigation.navigate("RetailerDetails")
    };

    const distributorDescription = (item) => {
        return (
            <View style={{marginBottom: 20}}>
                <View style={commonStyles.row}>
                    <Image resizeMode={"contain"} style={styles.cardImage} source={{uri: item.profile_picture}}/>
                    <BorderButtonBigRed text={item.name} ctaFunction={() => createOrder(item.pk)}/>
                </View>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            <PrimaryHeader navigation={props.navigation}/>
            {/* <BorderButtonBigRed text={'Create Order'} ctaFunction={() => createOrder()}/> */}
            <BorderButtonBigRed text={'Temprary Store details'} ctaFunction={() => storeDetails()}/>
            <FlatList
                data={distributorData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.name + ""}
                renderItem={({item, index}) => distributorDescription(item, index)}
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
        height: 30,
        width: 50
    }
});

export default connect(mapStateToProps, {setIsLoggedIn})(HomeScreen);
