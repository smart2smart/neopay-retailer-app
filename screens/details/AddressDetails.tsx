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

export default function AddressDetails(props) {

    const navigation = useNavigation();
    const [postalZip, setPostalZip] = useState('');
    const [locality, setLocality] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    const businessInfo = () => {
        navigation.navigate("BusinessInfo")
    }

    const storeDetails = () => {
        navigation.navigate("RetailerDetails")
    }

    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}> 
            <SecondaryHeader title={"Store Address"}/>
            <View style={{marginTop:20}}>
                <View style={styles.textInputDiv}>
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
                </View>
            </View>
            <View>
                <Text style={texts.redTextBold15}>Geo Location</Text>
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
})