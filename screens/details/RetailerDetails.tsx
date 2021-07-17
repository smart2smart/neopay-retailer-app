import React, { Component, useEffect, useState } from 'react';
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
import { setIsLoggedIn } from "../../actions/actions";
// @ts-ignore
import { connect, useSelector } from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import texts from '../../styles/texts';
import commonStyles from '../../styles/commonStyles';
import { BorderButtonSmallBlue, SolidButtonBlue } from '../../buttons/Buttons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/AntDesign';

export default function RetailerDetails(props) {

    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [name, setName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [gmailId, setGmailId] = useState('');
    const [newGeneralStore, setNewGeneralStore] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const addressDetails = () => {
        if (!newGeneralStore) {
            alertMsg("Please enter general store.");
            return
        }
        if (!contactPersonName) {
            alertMsg("Please enter contact person.");
            return
        }
        navigation.navigate("AddressDetails")
    }

    const alertMsg = (text: string) => {
        Alert.alert(text);
    }

    const data = [
        {type:"text", editable: true, placeholder: "New General Store*", onChange: setNewGeneralStore },
        {
            type:"text",
            editable: true,
            // property: contactPersonName,
            placeholder: "Contact Person*",
            onChange: setContactPersonName
        },
        {
            type:"number",
            editable: true,
            // property: contactPersonName,
            placeholder: "Contact Number",
            onChange: setContactNumber
        },
        {
            type:"text",
            editable: true,
            // property: contactPersonName,
            placeholder: "Gmail Id",
            onChange: setGmailId
        }
    ];

    useEffect(() => {
        setNewGeneralStore('');
        setContactPersonName('')
    }, [])

    return (
        <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: colors.white }}>
            <SecondaryHeader title={"Store Details"} />
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {data.map((item, index) => {
                        if (item.type === "text") {
                            return (
                                <View style={styles.textInputDiv}>
                                    <TextInput key={index} editable={item.editable}
                                        placeholder={item.placeholder}
                                        onChange={item.onChange} style={styles.textInput} />
                                </View>
                            )  
                        }   else {
                                return(
                                    <View style={styles.textInputDiv}>
                                        <View style={styles.textInputDiv}>
                                            <Text>
                                                Contact and Email
                                            </Text>
                                        </View>
                                        <View style={styles.textInput}>
                                            <View style={commonStyles.row}>
                                                <View style={[styles.countryCodeDiv, commonStyles.rowCenter]}>
                                                    <Text style={texts.greyNormal14}>
                                                        +91
                                                    </Text>
                                                    <Image style={styles.downArrow} source={require('../../assets/images/down_arrow.png')} />
                                                </View>
                                                <View>
                                                    <TextInput
                                                        key={index} editable={item.editable}
                                                        maxLength={10}
                                                        keyboardType={"numeric"}
                                                        placeholder={"799 115 4771"}
                                                        onChangeText={item.onChange}
                                                        style={{paddingLeft:20}}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                    })}
                </View>

                {/* <View style={styles.container}>
                        <View style={styles.textInputDiv}>
                            <TextInput
                                value={name}
                                placeholder={"New General Store"}
                                onChangeText={(text) => setName(text)}
                                style={styles.textInput}>
                            </TextInput>
                        </View>
                        <View style={styles.textInputDiv}>
                            <TextInput
                                value={contactPerson}
                                placeholder={"Contact person"}
                                onChangeText={(text) => setContactPerson(text)}
                                style={styles.textInput}>
                            </TextInput>
                        </View>
                        <View style={styles.textInputDiv}>
                            <Text>
                                Contact and Email
                            </Text>
                        </View>
                        <View style={styles.textInput}> 
                            <View style={commonStyles.row}>
                                <View style={[styles.countryCodeDiv, commonStyles.rowCenter]}>
                                    <Text style={texts.greyNormal14}>
                                        +91
                                    </Text>
                                    <Image style={styles.downArrow} source={require('../../assets/images/down_arrow.png')} />
                                </View>
                                <View>
                                    <TextInput
                                        value={phoneNo}
                                        maxLength={10}
                                        keyboardType={"numeric"}
                                        placeholder={"799 115 4771"}
                                        onChangeText={(text) => setPhoneNo(text)}
                                        style={{paddingLeft:20}}
                                    >
                                    </TextInput>
                                </View>
                            </View>
                        </View>
                        <View style={{paddingVertical:20}}>
                            <TextInput
                                value={gmailId}
                                placeholder={"Gmail Id"}
                                onChangeText={(text) => setGmailId(text)}
                                style={styles.textInput}>
                            </TextInput>
                        </View>
                    </View> */}
                <View style={commonStyles.rowFlexEnd}>
                    <SolidButtonBlue text={'NEXT'} ctaFunction={() => addressDetails()} />
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 16
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
    },
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
    }, countryCodeDiv: {
        // marginVertical:12,
        width: '26%',
        borderRightWidth: 1,
        borderRightColor: colors.light_grey,
    },
    downArrow: {
        width: 24,
        height: 24,
        marginLeft: 8
    },
})