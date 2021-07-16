import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import mapStateToProps from "../../store/mapStateToProps";
import {setIsLoggedIn} from "../../actions/actions";
// @ts-ignore
import {connect, useSelector} from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import texts from '../../styles/texts';
import commonStyles from '../../styles/commonStyles';
import { BorderButtonSmallBlue, SolidButtonBlue } from '../../buttons/Buttons';
import Icon from 'react-native-vector-icons/AntDesign';

export default function RetailerDetails(props) {

    // const addRetailerAddress = () => {
    //     if (!shopName) {
    //         alertMsg("Please enter shop name.");
    //         return
    //     }
    //     if (!contactPersonName) {
    //         alertMsg("Please enter contact person.");
    //         return
    //     }
    //     if (!line1) {
    //         alertMsg("Please enter address lin1");
    //         return
    //     }
    //     if (!selectedPinCode) {
    //         alertMsg("Please select pincode");
    //         return
    //     }
    //     let data = {
    //         name: shopName,
    //         contact_person_name: contactPersonName,
    //         email: email,
    //         line1: line1,
    //         line2: line2,
    //         locality: locality.name,
    //         beat_id: selectedBeat.id,
    //         pincode: selectedPinCode.pincode,
    //         gst_number: GSTIN,
    //         retailer_code: retailerCode
    //     }

    //     if(route.params.comingFrom==="edit"){
    //         data["address_id"]=addressId;
    //     }
    // }

    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    const search = (text: string) => {
        if(text===''){
            setData(originalData);
        }else {
            let filteredData = originalData.filter((item)=>{
                return item.name.toLowerCase().includes(text.toLowerCase());
            });
            setData(filteredData);
        }
        setSearchText(text);
    }

    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}> 
            <SecondaryHeader title={"Store Details"}/>
            {/* <View>
                <View style={[commonStyles.rowCenter]}>
                    <View style={{position: "relative"}}>
                        <Image style={styles.signature}
                        source={signature ? {uri: signature} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(true);
                            setImageType("signature");
                        }} style={styles.camera}>
                            <Entypo name="camera" size={24} color={colors.primary_color}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View> */}
            <TextInput
                value={searchText}
                maxLength={10}
                placeholder={"Search distributor and tap to select..."}
                onChangeText={(text) => search(text)}
                style={[commonStyles.textInput, texts.darkGreyNormal14]}>
            </TextInput>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: colors.white
    },
    image: {
        height: 200,
        width: 200,
        borderRadius: 30,
        marginTop: 20
    },
    signature: {
        height: 200,
        width: Dimensions.get("window").width - 48,
        marginTop: 20
    },
    camera: {
        position: "absolute",
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: colors.orangeFaded,
        borderRadius: 5,
        bottom: 10,
        right: 10
    }
})