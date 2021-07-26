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
import SelectBeatModal from "../../commons/SelectBeatModal";
import SelectLocalityModal from "../../commons/SelectLocality";
import {connect, useSelector} from 'react-redux';
import TextInputUnderline from "../../commons/TextInputUnderline";
import TextInputModal from "../../commons/TextInputModal";
import commonStyles from "../../styles/commonStyles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ProfileData() {

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
    const [beatPlanData, setBeatPlanData] = useState({mapped: [], all: []});
    const [selectedBeat, setSelectedBeat] = useState('');
    const [pincodeModalVisible, setPincodeModalVisible] = useState(false);
    const [beatPlanModalVisible, setBeatPlanModal] = useState(false);
    const [localityModalVisible, setLocalityModalVisible] = useState(false);
    const [retailerCode, setRetailerCode] = useState('');
    const distributorId = useSelector((state: any) => state.distributor.distributorId);
    const [image, setImage] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [addressId, setAddressId] = useState('');
    const [location, setLocation] = useState({latitude: '', longitude: ''});

    const selectPinCode = (item) => {
        setCity(item.city);
        setState(item.state);
        setSelectedPinCode(item);
        setLocality('');
        getLocalities(item.city.id)
    }

    const getLocalities = (cityId) => {
        const data = {
            method: commonApi.getLocalities.method,
            url: commonApi.getLocalities.url + "?city=" + cityId,
            header: commonApi.getLocalities.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.data) {
                setLocalityData(res.data);
            }
        })
    }


    useEffect(() => {
        setRetailerId(route.params.retailerId);
        getBeatList();
        const data = {
            method: commonApi.getPinCodeList.method,
            url: commonApi.getPinCodeList.url,
            header: commonApi.getPinCodeList.header
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.data) {
                setPinCodeData(res.data);
            }
        })
        if (route.params.data) {
            let data = route.params.data;
            setRetailerId(data.id);
            setImage(data.attachment);
            setShopName(data.name);
            setContactPersonName(data.contact_person_name);
            setContactNo(data.contact_no);
            setEmail(data.email);
            setGSTIN(data.gst_number);
            setRetailerCode(data.retailer_code);
            if (data.distributor_retailer_maps.length > 0 && data.distributor_retailer_maps[0]["beat__name"]) {
                setSelectedBeat({
                    id: data.distributor_retailer_maps[0]["beat__id"],
                    name: data.distributor_retailer_maps[0]["beat__name"]
                })
            }
            if (data.distributor_retailer_maps.length > 0 && data.distributor_retailer_maps[0]["retailer_code"]) {
                setRetailerCode(data.distributor_retailer_maps[0]["retailer_code"])
            }
            if (data.retailer_address) {
                setAddressId(data.retailer_address.id);
                setCity(data.retailer_address.city);
                getLocalities(data.retailer_address.city.id);
                setState(data.retailer_address.state);
                setLine1(data.retailer_address.line_1);
                setLine2(data.retailer_address.line_2);
                setLocality(data.retailer_address.locality);
                setSelectedPinCode(data.retailer_address.pincode);
                setLocation({latitude: data.retailer_address.latitude, longitude: data.retailer_address.longitude});
            }
        }
        if (route.params.image) {
            setImage(route.params.image);
        }
        if (route.params.location) {
            setLocation(route.params.location);
        }
    }, [route.params]);


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
        {type: "text", editable: true, property: retailerCode, placeholder: "Retailer Code", onChange: setRetailerCode},
        {type: "text", editable: true, property: line1, placeholder: "Address Line 1*", onChange: setLine1},
        {type: "text", editable: true, property: line2, placeholder: "Address Line 2", onChange: setLine2},
        {
            type: "modal",
            property: selectedPinCode,
            toggleModal: setPincodeModalVisible,
            modal: SelectModal,
            title: "Pincode",
            modalVisible: pincodeModalVisible,
            data: pinCodeData,
            selectItem: selectPinCode
        },
        {
            type: "modal",
            property: locality,
            toggleModal: setLocalityModalVisible,
            modal: SelectLocalityModal,
            title: "Locality",
            modalVisible: localityModalVisible,
            data: localityData,
            selectItem: setLocality
        },
        {type: "text", editable: false, property: city.name, placeholder: "City", onChange: setCity},
        {type: "text", editable: false, property: state.name, placeholder: "State", onChange: setState},
        {
            type: "modal", property: selectedBeat, toggleModal: setBeatPlanModal, modal: SelectBeatModal, title: "Beat",
            modalVisible: beatPlanModalVisible, data: beatPlanData, selectItem: setSelectedBeat
        },
        {type: "text", editable: true, property: GSTIN, placeholder: "GSTIN No", onChange: setGSTIN}
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
        let data = {
            name: shopName,
            contact_person_name: contactPersonName,
            email: email,
            line1: line1,
            line2: line2,
            contact_no:contactNo,
            locality: locality.name,
            beat_id: selectedBeat.id,
            pincode: selectedPinCode.pincode,
            gst_number: GSTIN,
            retailer_code: retailerCode
        }

        if(route.params.comingFrom==="edit"){
            data["address_id"]=addressId;
        }

        const dataToSend = {
            method: commonApi.updateRetailerAddress.method,
            url: commonApi.updateRetailerAddress.url + retailerId + '/?distributor_id=' + distributorId,
            header: commonApi.updateRetailerAddress.header,
            data: data
        }
        AuthenticatedPostRequest(dataToSend).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                if (route.params.comingFrom === "edit") {
                    Alert.alert("Details updated successfully.");
                    navigation.navigate('retailer-profile', {retailerId: retailerId});
                } else {
                    navigation.replace('map-view', {
                        addressId: res.data.retailer_address,
                        retailerId: retailerId
                    });
                }
            }
        })
    }

    const goToMapView = () => {
        if (!addressId) {
            Alert.alert("Please save retailer address first.")
        } else {
            navigation.navigate('map-view', {addressId: addressId, comingFrom: 'edit-profile'});
        }
    }

    const goToUploadImage = () => {
        navigation.navigate('upload-image', {retailerId: retailerId, image: image, comingFrom: 'edit-profile'});
    }

    const getBeatList = () => {
        const data = {
            method: commonApi.getBeatPlanList.method,
            url: commonApi.getBeatPlanList.url + "?distributor_id=" + distributorId,
            header: commonApi.getBeatPlanList.header
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setBeatPlanData(res.data);
        })
    }

    return (
        <View style={style.container}>
            <Indicator isLoading={isLoading}/>
            <View style={{paddingHorizontal: 24, paddingBottom: 10}}>
                <SecondaryHeader title={"Add Retailer"}/>
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
                    <View style={route.params.comingFrom==="edit"?style.textContainerAbsolute:style.textContainer}>
                        {data.map((item, index) => {
                            if (item.type === "text") {
                                return (
                                    <TextInputUnderline key={index} editable={item.editable} property={item.property}
                                                        placeholder={item.placeholder}
                                                        onChange={item.onChange}/>
                                )
                            } else {
                                return (
                                    <TextInputModal key={index} property={item.property} toggleModal={item.toggleModal}
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
            <View style={{paddingHorizontal: 24, paddingBottom: 20, paddingTop: 10}}>
                <SolidButtonBlue ctaFunction={addRetailerAddress} text={route.params.comingFrom === "edit"?"Save":"Next"}/>
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
