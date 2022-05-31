import {Dimensions, StyleSheet, Text, View} from "react-native";
import texts from "../styles/texts";
import colors from "../assets/colors/colors";
import React, {useEffect, useState} from "react";
import {DropDownLayout} from "./DropDownLayout";
import SelectModal from "./SelectModal";
import {commonApi} from "../api/api";
import {AuthenticatedGetRequest} from "../api/authenticatedGetRequest";


let timeout: any = null;
const LocalityDropDown = (props) => {

    const [localityData, setLocalityData] = useState([]);
    const [originalLocalityData, setOriginalLocalityData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    useEffect(() => {
        getLocalityData()
    }, [props.city]);

    const getLocalityFromSearch = (text) => {
        const data = {
            method: commonApi.getLocalities.method,
            url: commonApi.getLocalities.url + "?search=" + text,
            header: commonApi.getLocalities.header
        }
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                setLocalityData(res.data);
            }
        })
    }

    const searchLocality = (text) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (text != "") {
                let data = originalLocalityData.filter((item) => {
                    return item.name.toLowerCase().includes(text.toLowerCase())
                })
                if (data.length == 0) {
                    getLocalityFromSearch(text);
                } else {
                    setLocalityData(data)
                }
            } else {
                setLocalityData(originalLocalityData);
            }
        }, 800)
    }

    const selectLocality = (item) => {
        props.selectItem(item);
        closeModal();
    }

    //get localities from city remove location
    const getLocalityData = () => {
        const data = {
            method: commonApi.getLocalities.method,
            url: commonApi.getLocalities.url + "?city=" + props.city.id,
            header: commonApi.getLocalities.header
        }
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                setLocalityData(res.data);
                setOriginalLocalityData(res.data);
            }
        })
    }

    return (
        <View>
            <Text style={[texts.redTextBold12, {paddingTop: 20}]}>
                {"Locality:"}
            </Text>
            <DropDownLayout onPress={openModal} placeholder={"Select locality"} property={props.property}/>
            {modalVisible ? <SelectModal type={"locality"} isLoading={isLoading} identifier={"name"} data={localityData}
                                         closeModal={closeModal} searchItem={searchLocality} selectItem={selectLocality}
            /> : null}
        </View>)
}

export default LocalityDropDown;

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