import React, {useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
// @ts-ignore
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import { SolidButtonBlue } from "../../buttons/Buttons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';
import { commonApi } from "../../api/api";
import { AuthenticatedPostRequest } from "../../api/authenticatedPostRequest";
import Indicator from "../../utils/Indicator";
import commonStyles from "../../styles/commonStyles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RetailerDataModal from './RetailerDataModal';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {connect, useSelector} from 'react-redux';



let timeout: any = null;

export default function EditProfile() {

    const tabOptions = [
        { key: "storeDetails", value: "Store Details" },
        { key: "address", value: "Address" },
        { key: "businessDetails", value: "Business Details" }
    ]

    const navigation = useNavigation();
    const route = useRoute();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState("");
    const [retailerId, setRetailerId] = useState('');
    const [data, setData] = useState('');
    const [comingFrom, setComingFrom] = useState('');
    const distributor = useSelector((state: any) => state.distributor);

    useEffect(() => {
        setRetailerId(route.params.data.id);
        setData(route.params.data);
        setImage(route.params.image);
    }, [route.params]);

    const closeModal = () => {
        setModalVisible(false);
    }

    const goToUploadImage = () => {
        navigation.navigate('UploadImage', { retailerId: retailerId, image: image, comingFrom: 'editProfile' });
    }

    const openPopUp = (key) => {
        setModalVisible(true);
        setSelectedTab(key)
    }

    const saveData = (data) => {
        const dataToSend = {
            method: commonApi.updateRetailer.method,
            url: commonApi.updateRetailer.url + retailerId + '/?distributor_id=' + distributor.id,
            header: commonApi.updateRetailer.header,
            data: data
        }
        setIsLoading(true);
        AuthenticatedPostRequest(dataToSend).then((res) => {
            setIsLoading(false);
            if (res) {
                if (res.status == 200) {
                    Alert.alert("Details updated successfully.");
                    setModalVisible(false);
                    setData(res.data.data)
                } else {
                    Alert.alert("Error", res.data.error);
                }
            }
        })
    }


    return (
        <View style={style.container}>
            <Indicator isLoading={isLoading} />
            <View style={{ paddingHorizontal: 24, paddingBottom: 10 }}>
                <SecondaryHeader title={"Edit Profile"} />
            </View>
            <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}>
                <View>
                    {image ?
                        <View style={commonStyles.imageContainer}>
                            <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
                            <TouchableOpacity onPress={goToUploadImage} style={style.editButtonDiv}>
                                <MaterialIcons name="edit" size={24} color={colors.red} />
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
                </View>
                <View style={{ paddingHorizontal: 24 }}>
                    <View style={{ paddingTop: 20 }}>
                        <Text style={texts.redTextBold14}>
                            {"Edit Details"}
                        </Text>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        {tabOptions.map((item) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    openPopUp(item.key)
                                }} key={item.key} style={[commonStyles.rowSpaceBetween, style.tab]}>
                                    <View>
                                        <Text style={texts.darkGreyTextBold16}>
                                            {item.value}
                                        </Text>
                                    </View>
                                    <View style={style.editIcon}>
                                        <SimpleLineIcons name={"pencil"} size={14} color={"#A9294F"} />
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
                {modalVisible ?
                    <RetailerDataModal
                        comingFrom={comingFrom}
                        data={data}
                        saveData={saveData}
                        selectedTab={selectedTab}
                        closeModal={closeModal} /> : null}
            </ScrollView>
            <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
                <SolidButtonBlue text={"Done"} ctaFunction={() => {
                    navigation.goBack()
                }} />
            </View>
        </View>)
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light_grey
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
    tab: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey
    },
    editIcon: {
        backgroundColor: "#f6ebf0",
        width: 24,
        height: 24,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
});
