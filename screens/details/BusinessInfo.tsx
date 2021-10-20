import React, {Component, useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import mapStateToProps from "../../store/mapStateToProps";
import {setLandingScreen} from "../../actions/actions";
import {connect, useSelector} from 'react-redux';
import colors from "../../assets/colors/colors";
import commonStyles from '../../styles/commonStyles';
import {SolidButtonBlue, BorderButtonBigBlue} from '../../buttons/Buttons';
import {useNavigation} from "@react-navigation/native";
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import PersistenceStore from "../../utils/PersistenceStore";
import {StackActions} from '@react-navigation/native';

function BusinessInfo(props) {

    const navigation = useNavigation();
    const [pan, setPan] = useState('');
    const [gstno, setGstno] = useState('');
    const [faasino, setFaasino] = useState('');
    const [drugLicense, setDrugLicense] = useState('');
    const retailerData = useSelector((state: any) => state.retailerDetails);

    const addressDetails = () => {
        navigation.navigate("AddressDetails")
    }

    useEffect(() => {
        if (retailerData) {
            setPan(retailerData.pan_no);
            setGstno(retailerData.gst_number);
            setDrugLicense(retailerData.drug_registeration_no);
            setFaasino(retailerData.fssai_no);
        }
    }, []);

    const homePage = () => {
        let available = false;
        const data: any = {}
        if (gstno) {
            data["gst_number"] = gstno;
            available = true;
        }
        if (drugLicense) {
            data["drug_registeration_no"] = drugLicense;
            available = true;
        }
        if (faasino) {
            data["fssai_no"] = faasino;
            available = true;
        }
        if (pan) {
            data["pan_no"] = pan;
            available = true;
        }
        if (available) {
            let dataToSend = {
                method: commonApi.updateRetailerProfile.method,
                url: commonApi.updateRetailerProfile.url,
                header: commonApi.updateRetailerProfile.header,
                data: data
            }
            // @ts-ignore
            AuthenticatedPostRequest(dataToSend).then((res) => {
                if (res.status == 200) {
                    Alert.alert("Details updated successfully.");
                    props.setLandingScreen("home");
                    PersistenceStore.setLandingScreen("home");
                }
            })
        }
    }

    const alertMsg = (text: string) => {
        Alert.alert(text);
    }

    const data = [
        {
            editable: true,
            placeholder: "PAN No:",
            onChange: setPan,
            value: pan
        },
        {
            editable: true,
            placeholder: "GST Number:",
            onChange: setGstno,
            value: gstno
        },
        {
            editable: true,
            placeholder: "FASSAI Number:",
            onChange: setFaasino,
            value: faasino
        },
        {
            editable: true,
            placeholder: "Drug License:",
            onChange: setDrugLicense,
            value: drugLicense
        }
    ];

    return (
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <SecondaryHeader title={"Business Info"}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {data.map((item, index) => {
                        return (
                            <View style={styles.textInputDiv}>
                                <TextInput key={index} editable={item.editable}
                                           value={item.value}
                                           placeholder={item.placeholder}
                                           onChangeText={(text) => {
                                               item.onChange(text);
                                           }} style={styles.textInput}/>
                            </View>
                        )
                    })}
                </View>
                <View style={commonStyles.rowFlexEnd}>
                    <BorderButtonBigBlue text={'BACK'} ctaFunction={addressDetails}/>
                    <View style={{width: 10}}>

                    </View>
                    <SolidButtonBlue text={'SUBMIT'} ctaFunction={homePage}/>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 16
    },
    textInputDiv: {
        paddingBottom: 30,
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
})

export default connect(mapStateToProps, {setLandingScreen})(BusinessInfo);