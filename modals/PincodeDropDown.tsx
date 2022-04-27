import {Dimensions, StyleSheet, Text, View} from "react-native";
import texts from "../styles/texts";
import colors from "../assets/colors/colors";
import React, {useEffect, useState} from "react";
import {DropDownLayout} from "./DropDownLayout";
import SelectModal from "./SelectModal";
import {commonApi} from "../api/api";
import {AuthenticatedGetRequest} from "../api/authenticatedGetRequest";


const PincodeDropDown = (props) => {

    const [pincodeData, setPincodeData] = useState([]);
    const [originalPincodeData, setOriginalPincodeData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    useEffect(() => {
        getPincodeData()
    }, [props.district]);

    const searchPincode = (text) => {
        if (text != "") {
            let data = originalPincodeData.filter((item) => {
                return item.name.toLowerCase().includes(text.toLowerCase())
            })
            if (data.length == 0) {
                getPinCodeFromSearch(text);
            } else {
                setPincodeData(data)
            }
        } else {
            setPincodeData(originalPincodeData);
        }
    }

    const selectPincode = (item) => {
        props.selectItem(item);
        closeModal();
    }

    const getPinCodeFromSearch = (text) => {
        const data = {
            method: commonApi.getPinCodeList.method,
            url: commonApi.getPinCodeList.url + "?search=" + text,
            header: commonApi.getPinCodeList.header
        }
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                setPincodeData(res.data);
            }
        })
    }

    const getPincodeData = () => {
        const data = {
            method: commonApi.getPinCodeList.method,
            url: commonApi.getPinCodeList.url + "?district=" + props.district.id,
            header: commonApi.getPinCodeList.header
        }
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                setPincodeData(res.data);
                setOriginalPincodeData(res.data);
            }
        })
    }

    return (
        <View>
            <Text style={[texts.redTextBold12, {paddingTop: 20}]}>
                {"PinCode:"}
            </Text>
            <DropDownLayout onPress={openModal} placeholder={"Select PinCode"} property={props.property}/>
            {modalVisible ? <SelectModal type={"pincode"}  isLoading={isLoading} identifier={"name"} data={pincodeData}
                                         closeModal={closeModal} searchItem={searchPincode} selectItem={selectPincode}
            /> : null}
        </View>)
}

export default PincodeDropDown;

const styles = StyleSheet.create({
    modalContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 24
    },
    closeIconDiv: {
        alignItems: 'flex-end'
    },
    closeIcon: {
        paddingLeft: 10,
        paddingBottom: 10
    },
    container: {
        backgroundColor: colors.white,
        marginVertical: 40,
        borderRadius: 5,
        padding: 12,
        minHeight: Dimensions.get("window").height - 80
    },
})