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
    Alert,
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
import { BorderButtonSmallBlue, SolidButtonBlue, BorderButtonBigBlue } from '../../buttons/Buttons';
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import Icon from 'react-native-vector-icons/AntDesign';
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";

export default function BusinessInfo(props) {

    const navigation = useNavigation();
    const [pan, setPan] = useState('');
    const [gstno, setGstno] = useState('');
    const [faasino, setFaasino] = useState('');
    const [drungLicense, setDrungLicense] = useState('');

    const addressDetails = () => {
        if (!gstno) {
            alertMsg("Please enter GST Number");
            return
        }
        // navigation.navigate("AddressDetails")
    }

    const homePage = () => {
        console.log("Inside data")
        if (!gstno) {
            alertMsg("Please enter GST Number");
            return
        }
        const data = {
            gst_number: gstno,
            drug_registeration_no: drungLicense,
            fssai_no: faasino,
            pan_no: pan
        }
        console.log("DATAAAAAAAAAAA", data)
        let dataToSend = {}

            dataToSend = {
                method: commonApi.getBusinessInfo.method,
                url: commonApi.getBusinessInfo.url,
                header: commonApi.getBusinessInfo.header,
                data: data
            }
        // @ts-ignore
        AuthenticatedPostRequest(dataToSend).then((res) => {
            console.log("**", res);
            if (res.status == 200) {
                Alert.alert("Details updated successfully.");
                navigation.navigate("HomeScreen")
            }
        })
    }

    const alertMsg = (text: string) => {
        Alert.alert(text);
    }

    const data = [
        { editable: true, placeholder: "PAN: V125852BUI", onChange: setPan },
        {
            editable: true,
            // property: gstno,
            placeholder: "GST No.: BUI15538621",
            onChange: setGstno
        },
        {
            editable: true,
            // property: fassiNo,
            placeholder: "FASSI No.: 12325231",
            onChange: setFaasino
        },
        {
            editable: true,
            // property: drugLicense,
            placeholder: "Drug License: Lorem Ipsum",
            onChange: setDrungLicense
        }
    ];

    useEffect(() => {
        setPan('');
        setGstno('');
        setFaasino('');
        setDrungLicense('');
    }, [])
    
    return(
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
                                    }} style={styles.textInput} />
                            </View>
                        )
                    })}
                </View>
            {/* <View style={styles.container}>
                <View style={styles.textInputDiv}>
                    <TextInput
                        value={pan}
                        placeholder={"PAN: V125852BUI"}
                        onChangeText={(text) => setPan(text)}
                        style={styles.textInput}>
                    </TextInput>
                </View>
                <View style={styles.textInputDiv}>
                    <TextInput
                        value={gstno}
                        required
                        placeholder={"GST No. : BUI15538621"}
                        onChangeText={(text) => setGstno(text)}
                        style={styles.textInput}>
                    </TextInput>
                </View>
                <View style={styles.textInputDiv}>
                    <TextInput
                        value={faasino}
                        placeholder={"FASSI No. : 12325231"}
                        onChangeText={(text) => setFaasino(text)}
                        style={styles.textInput}>
                    </TextInput>
                </View>
                <View style={styles.textInputDiv}>
                    <TextInput
                        value={drungLicense}
                        placeholder={"Drug License : Lorem Ipsum"}
                        onChangeText={(text) => setDrungLicense(text)}
                        style={styles.textInput}>
                    </TextInput>
                </View>
            </View> */}
            {/* <View style={commonStyles.row}>
                <View>
                    <BorderButtonSmallBlue text={'BACK'} ctaFunction={() => addressDetails()}/>
                </View>
                <View style={{marginLeft:20}}>
                    <SolidButtonBlue text={'SUBMIT'} ctaFunction={() => homePage()}/>
                </View>
            </View> */}
            <View style={commonStyles.rowFlexEnd}>
                <BorderButtonBigBlue text={'BACK'} ctaFunction={() => addressDetails()} />
                <SolidButtonBlue text={'SUBMIT'} ctaFunction={() => homePage()} />
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