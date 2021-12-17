import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
// @ts-ignore
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import {SolidButtonBlue} from "../../buttons/Buttons";
import {useNavigation} from "@react-navigation/native";
import {useRoute} from '@react-navigation/native';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import Indicator from "../../utils/Indicator";
import SelectModal from "../../commons/SelectModal";
import SelectLocalityModal from "../../commons/SelectLocality";
import TextInputUnderline from "../../commons/TextInputUnderline";
import TextInputModal from "../../commons/TextInputModal";
import commonStyles from "../../styles/commonStyles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

let timeout: any = null;

export default function EditProfile() {

    const navigation = useNavigation();
    const route = useRoute();
    const [isLoading, setIsLoading] = useState(false);
    const [shopName, setShopName] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [retailerId, setRetailerId] = useState('');
    const [email, setEmail] = useState('');
    const [pinCodeData, setPinCodeData] = useState([]);
    const [selectedPinCode, setSelectedPinCode] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [locality, setLocality] = useState('');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [GSTIN, setGSTIN] = useState('');
    const [localityData, setLocalityData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [pincodeModalVisible, setPincodeModalVisible] = useState(false);
    const [localityModalVisible, setLocalityModalVisible] = useState(false);
    const [cityModalVisible, setCityModalVisible] = useState(false);
    const [image, setImage] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [panNo, setPanNo] = useState('');
    const [addressId, setAddressId] = useState('');
    const [location, setLocation] = useState({latitude: '', longitude: ''});

    const selectPinCode = (item) => {
        if(item.city){
            setCity(item.city);
        }
        setState(item.state);
        setSelectedPinCode(item);
        setLocality('');
    }

    const getLocalities = (text) => {
        let url = commonApi.getLocalities.url + "?search=" + text;
        if(city){
            url+= "&city="+city.id
        }
        const data = {
            method: commonApi.getLocalities.method,
            url: url,
            header: commonApi.getLocalities.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.data) {
                setLocalityData(res.data);
            }
        })
    }

    const selectLocality = (locality)=>{
        setLocality(locality);
        setLocalityData([]);
    }

    const selectCity = (city)=>{
        setCity(city);
        setCityData([]);
    }

    const searchPinCode = (text) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (text !== "") {
                getPinCodeList(text)
            }
        }, 500)
    }

    const searchCities = (text)=>{
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (text !== "") {
                getCities(text)
            }
        }, 500)
    }

    const getCities = (text)=>{
        const data = {
            method: commonApi.getCities.method,
            url: commonApi.getCities.url + "?search=" + text,
            header: commonApi.getCities.header
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.data) {
                setCityData(res.data);
            }
        })
    }

    const getPinCodeList = (text) => {
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
        })
    }

    useEffect(() => {
        setRetailerId(route.params.retailerId);
        if (route.params.data) {
            setData(route.params.data);
        }
        if (route.params.image) {
            setImage(route.params.image);
        }
        if (route.params.location) {
            setLocation(route.params.location);
        }
    }, [route.params]);

    const searchLocalities = (text) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (text !== "") {
                getLocalities(text)
            }
        }, 500)
    }

    const setData = (data) => {
        setRetailerId(data.id);
        setImage(data.attachment);
        setShopName(data.name);
        setContactPersonName(data.contact_person_name);
        setContactNo(data.contact_no);
        setEmail(data.email);
        setGSTIN(data.gst_number);
        setPanNo(data.pan_no);
        if (data.address_data) {
            setAddressId(data.address_data.id);
            setCity(data.address_data.city);
            setState(data.address_data.state);
            setLine1(data.address_data.line_1);
            setLine2(data.address_data.line_2);
            setLocality(data.address_data.locality);
            setSelectedPinCode(data.address_data.pincode);
            setLocation({latitude: data.address_data.latitude, longitude: data.address_data.longitude});
        }
    }


    const alertMsg = (text: string) => {
        Alert.alert(text);
    }

    const data = [
        {type: "text", editable: true, property: shopName, placeholder: "Shop Name*", onChange: setShopName},
        {
            type: "text",
            editable: true,
            property: contactPersonName,
            placeholder: "Contact Person*",
            onChange: setContactPersonName
        },
        {type: "text", editable: true, property: contactNo, placeholder: "Contact No", onChange: setContactNo},
        {type: "text", editable: true, property: email, placeholder: "Email", onChange: setEmail},
        {type: "text", editable: true, property: line1, placeholder: "Address Line 1*", onChange: setLine1},
        {type: "text", editable: true, property: line2, placeholder: "Address Line 2", onChange: setLine2},
        {
            type: "modal", property: selectedPinCode, toggleModal: setPincodeModalVisible,
            modal: SelectModal,
            title: "Pincode",
            modalVisible: pincodeModalVisible,
            data: pinCodeData,
            selectItem: selectPinCode,
            searchItem: searchPinCode,
            searchType: "api",

        },
        {
            type: "modal", property: locality, toggleModal: setLocalityModalVisible,
            modal: SelectLocalityModal,
            title: "Locality",
            modalVisible: localityModalVisible,
            data: localityData,
            selectItem: selectLocality,
            searchItem: searchLocalities,
            searchType: "api",
        },
        {
            type: "modal", property: city, toggleModal: setCityModalVisible,
            modal: SelectLocalityModal,
            title: "City",
            modalVisible: cityModalVisible,
            data: cityData,
            selectItem: selectCity,
            searchItem: searchCities,
            searchType: "api",
        },
        {type: "text", editable: false, property: state.name, placeholder: "State", onChange: setState},
        {type: "text", editable: true, property: GSTIN, placeholder: "GSTIN No", onChange: setGSTIN},
        {type: "text", editable: true, property: panNo, placeholder: "Pan No", onChange: setPanNo}
    ]

    const addRetailerAddress = () => {
        if (!shopName) {
            alertMsg("Please enter shop name.");
            return
        }
        if (!contactPersonName) {
            alertMsg("Please enter contact person.");
            return
        }
        if (!line1) {
            alertMsg("Please enter address lin1");
            return
        }
        if (!selectedPinCode) {
            alertMsg("Please select pincode");
            return
        }
        if(!locality){
            alertMsg("Please select locality");
            return
        }
        if(!city){
            alertMsg("Please select city");
            return
        }
        let address = {
            line_1: line1,
            line_2: line2,
            locality: locality.id,
            pincode: selectedPinCode.id,
            city: city.id,
            state: state.id,
        }
        if (location.latitude) {
            address["latitude"] = location.latitude;
        }
        if (location.longitude) {
            address["longitude"] = location.longitude;
        }
        let data = {
            name: shopName,
            contact_person_name: contactPersonName,
            email: email,
            contact_no: contactNo,
            address: JSON.stringify(address),
            gst_number: GSTIN,
            pan_no: panNo
        }
        if (route.params.comingFrom === "edit") {
            data["address_id"] = addressId;
        }
        const dataToSend = {
            method: commonApi.updateRetailerProfile.method,
            url: commonApi.updateRetailerProfile.url,
            header: commonApi.updateRetailerProfile.header,
            data: data
        }
        AuthenticatedPostRequest(dataToSend).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                Alert.alert("Details updated successfully.")
                navigation.navigate("Account");
            } else {
                Alert.alert(res.data.message);
            }
        })
    }

    const goToMapView = () => {
        if (!addressId) {
            Alert.alert("Please save retailer address first.")
        } else {
            navigation.navigate('MapViewScreen', {addressId: addressId, comingFrom: 'edit', currentLocation:location});
        }
    }

    const goToUploadImage = () => {
        navigation.navigate('UploadImage', {retailerId: retailerId, image: image, comingFrom: 'editProfile'});
    }

    return (
        <View style={style.container}>
            <Indicator isLoading={isLoading}/>
            <View style={{paddingHorizontal: 24, paddingBottom: 10}}>
                <SecondaryHeader title={"Edit Profile"}/>
            </View>
            <ScrollView nestedScrollEnabled={true} style={{flex: 1}}
                        showsVerticalScrollIndicator={false}>
                {route.params.comingFrom === "edit" ? <View>
                    {image ?
                        <View style={commonStyles.imageContainer}>
                            <Image source={{uri: image}} style={{width: '100%', height: '100%'}}/>
                            <TouchableOpacity onPress={goToUploadImage} style={style.editButtonDiv}>
                                <MaterialIcons name="edit" size={24} color={colors.red}/>
                            </TouchableOpacity>
                        </View> :
                        <View style={commonStyles.imageContainer}>
                            <Text style={texts.darkGrey18Bold}>
                                Add storage image
                            </Text>
                            <TouchableOpacity onPress={goToUploadImage} style={style.addDiv}>
                                <Text style={texts.redTextBold15}>
                                    +
                                </Text>
                            </TouchableOpacity>
                        </View>}
                </View> : null}
                <View style={route.params.comingFrom === "edit" ? {
                    position: "relative",
                    height: 1140,
                    justifyContent: 'flex-end',
                    paddingBottom: 20
                } : {}}>
                    <View
                        style={route.params.comingFrom === "edit" ? style.textContainerAbsolute : style.textContainer}>
                        {data.map((item, index) => {
                            if (item.type === "text") {
                                return (
                                    <TextInputUnderline key={index} editable={item.editable} property={item.property}
                                                        placeholder={item.placeholder}
                                                        onChange={item.onChange}/>
                                )
                            } else {
                                return (
                                    <TextInputModal key={index} searchItem={item.searchItem}
                                                    searchType={item.searchType}
                                                    property={item.property} toggleModal={item.toggleModal}
                                                    modal={item.modal} title={item.title}
                                                    modalVisible={item.modalVisible} data={item.data}
                                                    selectItem={item.selectItem}
                                    />)
                            }
                        })}
                        {route.params.comingFrom === "edit" ? <View style={style.textInputDiv}>
                            <View style={commonStyles.row}>
                                <Text style={texts.redTextBold14}>Location: </Text>
                                <Text
                                    style={texts.greyNormal14}>{location.latitude.toString().substring(0, 10)}, </Text>
                                <Text style={texts.greyNormal14}>{location.longitude.toString().substring(0, 10)}</Text>
                            </View>
                            <View style={[commonStyles.row, {marginTop: 20}]}>
                                <TouchableOpacity onPress={goToMapView}>
                                    <Text style={[texts.blueBoldl14, style.underline]}>
                                        Choose on Map
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View> : null}
                    </View>
                </View>
            </ScrollView>
            <View style={[commonStyles.row, {paddingHorizontal: 24, paddingBottom: 20, paddingTop: 10}]}>
                <SolidButtonBlue ctaFunction={addRetailerAddress}
                                 text={route.params.comingFrom === "edit" ? "Save" : "Next"}/>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light_grey
    },
    textContainer: {
        padding: 16,
        borderRadius: 5,
        borderColor: colors.grey,
        backgroundColor: '#ffffff',
        elevation: 2,
        marginHorizontal: 24,
        marginVertical: 20,
        marginBottom: 100
    },
    textContainerAbsolute: {
        padding: 16,
        borderRadius: 5,
        borderColor: colors.grey,
        backgroundColor: '#ffffff',
        elevation: 2,
        position: 'absolute',
        width: Dimensions.get("window").width - 48,
        marginHorizontal: 24,
        top: -50
    },
    addDiv: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        marginTop: 20,
        elevation: 2,
        marginBottom: 50
    },
    editButtonDiv: {
        backgroundColor: colors.orangeFaded,
        borderWidth: 1,
        borderColor: colors.red,
        padding: 7,
        borderRadius: 2,
        position: 'absolute',
        right: 20,
        top: 20
    },
    underline: {
        borderBottomWidth: 1.5,
        borderBottomColor: colors.blue,
        paddingBottom: 2
    },
    textInputDiv: {
        paddingBottom: 30
    },
});
