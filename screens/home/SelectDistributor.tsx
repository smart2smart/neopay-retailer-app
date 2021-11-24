import React, {Component, useEffect, useState} from 'react';
import {
    Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity,
    View,
} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import {useNavigation} from "@react-navigation/native";
import {useRoute} from '@react-navigation/native';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import texts from "../../styles/texts";
import colors from "../../assets/colors/colors";
import {connect} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {setDistributor, clearCart} from "../../actions/actions";
import PersistenceStore from "../../utils/PersistenceStore";


function SelectDistributor(props) {

    const [distributorData, setDistributorData] = useState([]);
    const [refreshing] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();

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

    const selectDistributor = (distributor) => {
        props.setDistributor(distributor);
        PersistenceStore.setDistributor(JSON.stringify(distributor))
        props.clearCart();
        navigation.navigate("Home");
    }

    useEffect(() => {
        getDistributorDetails();
    }, []);

    const distributorDescription = ({item}) => {
        return (
            <TouchableOpacity onPress={() => {
                selectDistributor(item)
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
        <View style={{flex: 1, paddingHorizontal: 24}}>
            <SecondaryHeader title={"Select Distributor"}/>
               <View style={{backgroundColor:"white", borderRadius:5, flex:1, marginVertical:10}}>
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
               </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    cardImage: {
        height: 50,
        width: 50,
        borderRadius: 10
    },
})

export default connect(mapStateToProps, {setDistributor, clearCart})(SelectDistributor);