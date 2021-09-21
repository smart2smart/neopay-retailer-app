import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import texts from '../../styles/texts';
import commonStyles from '../../styles/commonStyles';
import {BorderButtonBigBlue, BorderButtonSmallBlue, SolidButtonBlue} from '../../buttons/Buttons';
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import SelectModal from "../../commons/SelectModal";
import TextInputModal from "../../commons/TextInputModal";
import SelectLocalityModal from "../../commons/SelectLocality";
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import PersistenceStore from "../../utils/PersistenceStore";
import {connect, useSelector} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {setLandingScreen} from "../../actions/actions";

let timeout: any = null;

function AddressDetails(props) {

    const navigation = useNavigation();
    const route = useRoute();
    const [locality, setLocality] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincodeModalVisible, setPincodeModalVisible] = useState(false);
    const [localityModalVisible, setLocalityModalVisible] = useState(false);
    const [localityData, setLocalityData] = useState([]);
    const [pinCodeData, setPinCodeData] = useState([]);
    const [selectedPinCode, setSelectedPinCode] = useState();
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const retailerData = useSelector((state: any) => state.retailerDetails);

    const selectPinCode = (item) => {
        setCity(item.city);
        setState(item.state);
        setSelectedPinCode(item);
        setLocality('');
    }

    useEffect(() => {
        if (retailerData) {
            if (retailerData.address_data) {
                setSelectedPinCode(retailerData.address_data.pincode);
                setLocality(retailerData.address_data.locality);
                setAddress1(retailerData.address_data.line_1);
                setAddress2(retailerData.address_data.line_2);
                setLatitude(retailerData.address_data.latitude);
                setLongitude(retailerData.address_data.longitude);
                setCity(retailerData.address_data.city);
                setState(retailerData.address_data.state);
            }
        }
    }, [])

    const searchLocalities = (text:string) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if(text !== ""){
                getLocalities(text)
            }
        }, 500)
    }

    const getLocalities = (text:string) => {
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
        console.log(text);
        const data = {
            method: commonApi.getLocalities.method,
            url: commonApi.getLocalities.url + "?search=" + text,
            header: commonApi.getLocalities.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            console.log("dddddddddddddddddddddddddddddddddddddddddddddddd")
            console.log(res)
            if (res.data) {
                setLocalityData(res.data);
            }
        })
    }

    const businessInfo = () => {
        if (!selectedPinCode) {
            alertMsg("Please select pincode");
            return;
        }
        if (!locality) {
            alertMsg("Please enter your locality");
            return;
        }
        if (!address1) {
            alertMsg("Please enter your address");
            return
        }
        if (!latitude) {
            alertMsg("Please select location");
        }

        let data = {
            address: JSON.stringify({
                line_1: address1,
                line_2: address2,
                locality: locality.id,
                pincode: selectedPinCode.id,
                latitude: latitude,
                longitude: longitude,
                city: city.id,
                state: state.id
            })
        }

        let dataToSend = {
            method: commonApi.updateRetailerProfile.method,
            url: commonApi.updateRetailerProfile.url,
            header: commonApi.updateRetailerProfile.header,
            data: data
        }
        AuthenticatedPostRequest(dataToSend).then((res) => {
            if (res.status == 200) {
                Alert.alert("Details updated successfully.");
                props.setLandingScreen("license");
                PersistenceStore.setLandingScreen("license");
                navigation.navigate("BusinessInfo")
            }
        })
    }

    useFocusEffect(
        React.useCallback(() => {
            if (route.params) {
                if (route.params.location) {
                    setLatitude(route.params.location.latitude);
                    setLongitude(route.params.location.longitude);
                }
            }
        }, [route.params])
    );

    const alertMsg = (text: string) => {
        Alert.alert(text);
    }

    const openLocalityModal = () => {
        if (selectedPinCode === '') {
            Alert.alert("Please select pincode first.")
        } else {
            setLocalityModalVisible(true);
        }
    }

    const getPinCodes = (text) => {
        const data = {
            method: commonApi.getPinCodeList.method,
            url: commonApi.getPinCodeList.url + "?search=" + text,
            header: commonApi.getPinCodeList.header
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.data) {
                setPinCodeData(res.data);
            }
            timeout = null;
        })
    }

    const searchPinCode = (text) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if(text !== ""){
                getPinCodes(text)
            }
        }, 500)
    }


    const data = [
        {
            type: "modal",
            property: selectedPinCode,
            toggleModal: setPincodeModalVisible,
            modal: SelectModal,
            title: "Postal Zip",
            modalVisible: pincodeModalVisible,
            data: pinCodeData,
            selectItem: selectPinCode,
            searchItem: searchPinCode,
            searchType: "api"
        },
        {
            type: "modal",
            property: locality,
            toggleModal: setLocalityModalVisible,
            modal: SelectLocalityModal,
            title: "Locality",
            modalVisible: localityModalVisible,
            data: localityData,
            selectItem: setLocality,
            searchItem: searchLocalities,
            searchType: "api"
        },
        {type: "text", editable: true, placeholder: "Address Line 1", onChange: setAddress1, value: address1},
        {type: "text", editable: true, placeholder: "Address Line 2", onChange: setAddress2, value: address2},
    ];

    const goToRetailerDetails = () => {
        navigation.navigate("RetailerDetails")
    }

    const goToMapView = () => {
        navigation.navigate('MapViewScreen');
    }

    useEffect(() => {

    }, [])

    return (
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <SecondaryHeader manualNavigate={"RetailerDetails"} title={"Store Address"}/>
            <View style={{marginTop: 20}}>
                {data.map((item, index) => {
                    if (item.type === "text") {
                        return (
                            <View style={styles.textInputDiv}>
                                <TextInput key={index} editable={item.editable}
                                           placeholder={item.placeholder}
                                           onChangeText={item.onChange}
                                           value={item.value}
                                           style={styles.textInput}/>
                            </View>
                        )
                    } else {
                        return (
                            <TextInputModal searchItem={item.searchItem} searchType={item.searchType}
                                            key={index} property={item.property} toggleModal={item.toggleModal}
                                            modal={item.modal} title={item.title}
                                            modalVisible={item.modalVisible} data={item.data}
                                            selectItem={item.selectItem}
                            />)
                    }
                })}
            </View>
            <View style={commonStyles.row}>
                <Text style={texts.redTextBold14}> Geo Location: </Text>
            </View>
            <View style={[commonStyles.row, {marginVertical: 10}]}>
                {latitude ?
                    <View style={[commonStyles.rowSpaceBetween, {width: '100%'}]}>
                        <View>
                            <Text style={texts.greyTextBold14}>
                                Latitude: {latitude}
                            </Text>
                            <Text style={texts.greyTextBold14}>
                                Longitude: {longitude}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={goToMapView}>
                            <Text style={[texts.redTextBold14, {textDecorationLine: "underline"}]}>
                                Change
                            </Text>
                        </TouchableOpacity>
                    </View> : <TouchableOpacity onPress={goToMapView}>
                        <Text style={[texts.blueBoldl14, styles.underline]}>
                            Choose on Map
                        </Text>
                    </TouchableOpacity>}
            </View>
            <View style={[commonStyles.rowSpaceBetween, {paddingTop: 30}]}>
                <BorderButtonBigBlue text={'BACK'} ctaFunction={goToRetailerDetails}/>
                <View style={{width: 10}}>
                </View>
                <SolidButtonBlue text={'NEXT'} ctaFunction={() => businessInfo()}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textInputDiv: {
        paddingBottom: 30
    },
    textInput: {
        borderColor: '#e6e6e6',
        fontFamily: "GothamMedium",
        borderWidth: 1,
        width: '100%',
        height: 50,
        borderRadius: 5,
        padding: 10
    },
    underline: {
        borderBottomWidth: 1.5,
        borderBottomColor: colors.blue,
        paddingBottom: 2
    },
})

export default connect(mapStateToProps, {setLandingScreen})(AddressDetails);