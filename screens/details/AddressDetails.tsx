import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert
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
import { BorderButtonBigBlue, BorderButtonSmallBlue, SolidButtonBlue } from '../../buttons/Buttons';
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import Icon from 'react-native-vector-icons/AntDesign';
import SelectModal from "../../commons/SelectModal";
import TextInputModal from "../../commons/TextInputModal";
import SelectLocalityModal from "../../commons/SelectLocality";
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";

export default function AddressDetails(props) {

    const navigation = useNavigation();
    const [postalZip, setPostalZip] = useState('');
    const [locality, setLocality] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [pincodeModalVisible, setPincodeModalVisible] = useState(false);
    const [pinCodeData, setPinCodeData] = useState([]);
    const [localityModalVisible, setLocalityModalVisible] = useState(false);
    const [selectedPinCode, setSelectedPinCode] = useState('');
    const [localityData, setLocalityData] = useState([]);

    const selectPinCode = (item) => {
        console.log("123")
    }

    const businessInfo = () => {
        if (!address1) {
            alertMsg("Please enter your address");
            return
        }

        const data = {
            retailer_address : address1,
        }
        console.log("DATAAAAAAAAAAA", data)
        let dataToSend = {}

            dataToSend = {
                method: commonApi.retailerAddrerss.method,
                url: commonApi.retailerAddrerss.url,
                header: commonApi.retailerAddrerss.header,
                data: data
            }
        // @ts-ignore
        AuthenticatedPostRequest(dataToSend).then((res) => {
            console.log("**", res);
            if (res.status == 200) {
                Alert.alert("Details updated successfully.");
                navigation.navigate("BusinessInfo")
            }
        })
        // navigation.navigate("BusinessInfo")
    }

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
        {
            type: "modal",
            property: selectedPinCode,
            toggleModal: setPincodeModalVisible,
            modal: SelectModal,
            title: "Postal Zip",
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
        {type: "text", editable: true, placeholder: "Address Line 1", onChange: setAddress1},
        {type: "text", editable: true, placeholder: "Address Line 2", onChange: setAddress2},
    ];

    // const businessInfo = () => {
    //     navigation.navigate("BusinessInfo")
    // }

    const storeDetails = () => {
        navigation.navigate("RetailerDetails")
    }

    const goToMapView = () => {
            navigation.navigate('MapView');
    }

    useEffect(() => {
        setAddress1('');
        setAddress2('');
    }, [])

    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}> 
            <SecondaryHeader title={"Store Address"}/>
            <View style={{marginTop:20}}>
            {data.map((item, index) => {
                            if (item.type === "text") {
                                return (
                                    <View style={styles.textInputDiv}>
                                    <TextInput key={index} editable={item.editable}
                                                        placeholder={item.placeholder}
                                                        onChangeText={item.onChange} style={styles.textInput} />
                                                        </View>
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
                {/* <View style={styles.textInputDiv}>
                    <TextInput
                        value={postalZip}
                        placeholder={"POSTAL ZIP"}
                        onChangeText={(text) => setPostalZip(text)}
                        style={styles.textInput}>
                    </TextInput>
                </View>
                <View style={styles.textInputDiv}>
                    <TextInput
                        value={locality}
                        placeholder={"Locality"}
                        onChangeText={(text) => setLocality(text)}
                        style={styles.textInput}>
                    </TextInput>
                </View>
                <View style={styles.textInputDiv}>
                    <TextInput
                        value={address1}
                        placeholder={"Address Line 1"}
                        onChangeText={(text) => setAddress1(text)}
                        style={styles.textInput}>
                    </TextInput>
                </View>
                <View style={styles.textInputDiv}>
                    <TextInput
                        value={address2}
                        placeholder={"Address Line 2"}
                        onChangeText={(text) => setAddress2(text)}
                        style={styles.textInput}>
                    </TextInput>
                </View> */}
            </View>
            {/* <View>
                <Text style={texts.redTextBold15}>Geo Location</Text>
            </View> */}
            <View style={commonStyles.row}>
                <Text style={texts.redTextBold14}> Geo Location: </Text>
            </View>
            <View style={[commonStyles.row, {marginTop: 20}]}>
                <TouchableOpacity onPress={goToMapView}>
                    <Text style={[texts.blueBoldl14, styles.underline]}>
                        Choose on Map
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={commonStyles.rowFlexEnd}>
                <BorderButtonBigBlue text={'BACK'} ctaFunction={() => storeDetails()}/>
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