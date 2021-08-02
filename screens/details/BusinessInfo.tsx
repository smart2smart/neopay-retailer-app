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
import {setIsLoggedIn, setLandingScreen} from "../../actions/actions";
import {connect, useSelector} from 'react-redux';
import colors from "../../assets/colors/colors";
import commonStyles from '../../styles/commonStyles';
import {BorderButtonSmallBlue, SolidButtonBlue, BorderButtonBigBlue} from '../../buttons/Buttons';
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import PersistenceStore from "../../utils/PersistenceStore";

function BusinessInfo(props) {

    const navigation = useNavigation();
    const [pan, setPan] = useState('');
    const [gstno, setGstno] = useState('');
    const [faasino, setFaasino] = useState('');
    const [drugLicense, setDrugLicense] = useState('');

    const addressDetails = () => {
        if (!gstno) {
            alertMsg("Please enter GST Number");
            return
        }
        // navigation.navigate("AddressDetails")
    }

    const homePage = () => {
        if (!gstno) {
            alertMsg("Please enter GST Number");
            return
        }
        const data = {
            gst_number: gstno,
            drug_registeration_no: drugLicense,
            fssai_no: faasino,
            pan_no: pan
        }

        let dataToSend = {
            method: commonApi.updateRetailerProfile.method,
            url: commonApi.updateRetailerProfile.url,
            header: commonApi.updateRetailerProfile.header,
            data: data
        }
        // @ts-ignore
        AuthenticatedPostRequest(dataToSend).then((res) => {
            console.log("**", res);
            if (res.status == 200) {
                Alert.alert("Details updated successfully.");
                props.setLandingScreen("home");
                PersistenceStore.setLandingScreen("home");
                navigation.navigate("HomeScreen")
            }
        })
    }

    const alertMsg = (text: string) => {
        Alert.alert(text);
    }

    const data = [
        {editable: true, placeholder: "PAN: V125852BUI", onChange: setPan},
        {
            editable: true,
            // property: gstno,
            placeholder: "GST Number:",
            onChange: setGstno
        },
        {
            editable: true,
            // property: fassiNo,
            placeholder: "FASSAI Number:",
            onChange: setFaasino
        },
        {
            editable: true,
            // property: drugLicense,
            placeholder: "Drug License:",
            onChange: setDrugLicense
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
                                           placeholder={item.placeholder}
                                           onChangeText={(text) => {
                                               item.onChange(text);
                                           }} style={styles.textInput}/>
                            </View>
                        )
                    })}
                </View>
                <View style={commonStyles.rowFlexEnd}>
                    <BorderButtonBigBlue text={'BACK'} ctaFunction={() => addressDetails()}/>
                    <View style={{width:10}}>

                    </View>
                    <SolidButtonBlue text={'SUBMIT'} ctaFunction={() => homePage()}/>
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