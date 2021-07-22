import React, {useState, useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {Text, View, StyleSheet, Platform, Image, TouchableOpacity, Alert} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import commonStyles from "../../styles/commonStyles";
import texts from "../../styles/texts";
import {BorderButtonSmallRed, SolidButtonBlue} from "../../buttons/Buttons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from "@react-navigation/native";
import {AuthenticatedPostRequest, UploadFileRequest} from "../../api/authenticatedPostRequest";
import {commonApi} from "../../api/api";
import Indicator from "../../utils/Indicator";

export default function UploadImage() {

    const navigation = useNavigation();
    const route = useRoute();

    const [image, setImage] = useState(null);
    const [retailerId, setRetailerId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isNewImage, setIsNewImage] = useState(false);


    useEffect(() => {
        // setImage(route.params.image);
        (async () => {
            if (Platform.OS !== 'web') {
                const {status: status1} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                const {status: status2} = await ImagePicker.requestCameraPermissionsAsync();
                if (status1 !== 'granted' || status2 !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
            setIsNewImage(true);
        }
    };

    const captureImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5
        });

        if (!result.cancelled) {
            setImage(result.uri);
            setIsNewImage(true);
        }
    }


    const goBackToPreviousScreen = async () => {

        if (!isNewImage) {
            Alert.alert("Please select new image first.")
            return;
        }

        let localUri = image;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;


        const formData = new FormData();
        formData.append('attachment', {
            uri: localUri,
            type: type, // or photo.type
            name: filename
        });

        setIsLoading(true);
        const data = {
            method: commonApi.updateRetailerImage.method,
            // url: commonApi.updateRetailerImage.url + retailerId + '/',
            url: commonApi.updateRetailerImage.url,
            header: commonApi.updateRetailerImage.header,
            data: formData
        }
        console.log("*******", data)
        UploadFileRequest(data)
            .then((res) => {
                setIsLoading(false);
                if (res && res.status == 200) {
                    if (route.params.comingFrom === 'retailer-details') {
                        navigation.navigate('RetailerDetails', {image: image})
                    } 
                    // else {
                    //     navigation.replace("RetailersList")
                    // }
                } else {
                    Alert.alert(res.data.error);
                }
            })
    }

    return (
        <View style={style.container}>
            <Indicator isLoading={isLoading}/>
            <View style={{paddingHorizontal: 24, paddingBottom: 10}}>
                <SecondaryHeader title={"Add Store Image"}/>
            </View>
            <View style={commonStyles.columnSpaceBetween}>
                <View>
                    <View style={commonStyles.imageContainer}>
                        {image ? <Image source={{uri: image}} style={{width: '100%', height: '100%'}}/> :
                            <View style={style.textDiv}>
                            <Text style={texts.darkGrey18Bold}>
                                Add storage image
                            </Text>
                                <Text style={[texts.darkGreyNormal14, {marginTop:10}]}>
                                    Select one of the options from below
                                </Text>
                            </View>}
                    </View>
                    <View>
                        <View style={style.ctaContainer}>
                            <View style={[style.ctaDiv, style.borderBottom]}>
                                <Text style={texts.blueBoldl14}>
                                    {image?"Change Profile Photo":"Add New Photo"}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={captureImage} style={[style.ctaDiv, style.borderBottom]}>
                                <Text style={texts.greyTextBold14}>
                                    Capture with Camera
                                </Text>
                                <View style={style.iconDiv}>
                                    <MaterialIcons name="keyboard-arrow-right" size={22} color={colors.red}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImage} style={[style.ctaDiv, style.borderBottom]}>
                                <Text style={texts.greyTextBold14}>
                                    Upload from Device
                                </Text>
                                <View style={style.iconDiv}>
                                    <MaterialIcons name="keyboard-arrow-right" size={22} color={colors.red}/>
                                </View>
                            </TouchableOpacity>
                            <View style={style.ctaDiv}>
                                <Text style={texts.greyTextBold14}>
                                    Remove Photo
                                </Text>
                                <MaterialCommunityIcons name="delete" size={22} color={colors.red}/>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={style.buttonContainer}>
                    <SolidButtonBlue text={"Save Image"} ctaFunction={goBackToPreviousScreen}/>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    buttonDiv: {
        alignItems: 'flex-end',
        marginTop: 20,
        marginRight: 24
    },
    ctaContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingVertical: 20
    },
    ctaDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey
    },
    iconDiv: {
        backgroundColor: colors.orangeFaded,
        borderRadius: 10
    },
    buttonContainer:{
        marginHorizontal:20,
        marginBottom:16,
        flexDirection:'row'
    },
    textDiv:{
        justifyContent:'center',
        alignItems:'center'
    }
});
