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
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function RetailerDetails(props) {

    const navigation = useNavigation();
    const [gmailId, setGmailId] = useState('');
    const [newGeneralStore, setNewGeneralStore] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [image, setImage] = useState('');

    const addressDetails = () => {
        if (!newGeneralStore) {
            alertMsg("Please enter general store.");
            return
        }
        if (!contactPersonName) {
            alertMsg("Please enter contact person.");
            return
        }

        const data = {
            name: newGeneralStore,
            contact_person_name: contactPersonName,
            contact_no: contactNumber,
            email: gmailId,
        }
        let dataToSend = {}
        
            dataToSend = {
                method: commonApi.storeDetails.method,
                url: commonApi.storeDetails.url,
                header: commonApi.storeDetails.header,
                data: data
            }
        
             // @ts-ignore
            AuthenticatedPostRequest(dataToSend).then((res) => {
                if (res.status == 200) {
                    Alert.alert("Details updated successfully.");
                    navigation.navigate("AddressDetails")
                }
        })
        // navigation.navigate("AddressDetails")
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

    const goToUploadImage = () => {
        // navigation.navigate('UploadImage', {retailerId: retailerId, image: image, comingFrom: 'edit-profile'});
        navigation.navigate('UploadImage', {image: image, comingFrom: 'retailer-details'});
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: colors.white }}>
            <SecondaryHeader title={"Store Details"} />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={[commonStyles.imageContainer, {marginBottom:20}]}>
                        <Image source={{uri: image}} style={{width: '100%', height: '100%'}}/>
                        <TouchableOpacity onPress={goToUploadImage} style={styles.editButtonDiv}>
                            <MaterialIcons name="edit" size={24} color={colors.red}/>
                        </TouchableOpacity>
                    </View>
                    {data.map((item, index) => {
                        if (item.type === "text") {
                            return (
                                <View style={styles.textInputDiv}>
                                    <TextInput key={index} editable={item.editable}
                                        placeholder={item.placeholder}
                                        onChangeText={item.onChange} style={styles.textInput} />
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
        borderRightColor: colors.lightGrey,
    },
    downArrow: {
        width: 24,
        height: 24,
        marginLeft: 8
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
})