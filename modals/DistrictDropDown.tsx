import {Dimensions, StyleSheet, Text, View} from "react-native";
import texts from "@texts";
import React, {useEffect, useState} from "react";
import {DropDownLayout} from "./DropDownLayout";
import SelectModal from "./SelectModal";
import {commonApi} from "@api";
import {AuthenticatedGetRequest} from "@authenticatedGetRequest";
import colors from "@colors";

let timeout: any = null;
const DistrictDropDown = (props) => {

    const [districtData, setDistrictData] = useState([]);
    const [originalDistrictData, setOriginalDistrictDataData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    useEffect(() => {
        getDistrictData();
    }, [props.state]);


    const searchDistrict = (text) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (text != "") {
                let data = originalDistrictData.filter((item) => {
                    return item.name.toLowerCase().includes(text.toLowerCase())
                })
                if (data.length === 0) {
                    fetchDistrictFromSearch(text);
                } else {
                    setDistrictData(data)
                }
            } else {
                setDistrictData(originalDistrictData);
            }
        }, 800)
    }

    const fetchDistrictFromSearch = (text) => {
        const data = {
            method: commonApi.getDistrictList.method,
            url: commonApi.getDistrictList.url + "?search=" + text,
            header: commonApi.getDistrictList.header
        }
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                setDistrictData(res.data);
            }
        })
    }

    const selectDistrict = (item) => {
        props.selectItem(item);
        closeModal();
    }

    const getDistrictData = () => {
        const data = {
            method: commonApi.getDistrictList.method,
            url: commonApi.getDistrictList.url + "?state=" + props.state.id,
            header: commonApi.getDistrictList.header
        }
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                setDistrictData(res.data);
                setOriginalDistrictDataData(res.data);
            }
        })
    }

    return (
        <View>
            <Text style={[texts.redTextBold12, {paddingTop: 20}]}>
                {"District:"}
            </Text>
            <DropDownLayout onPress={openModal} placeholder={"Select district"} property={props.property}/>
            {modalVisible ? <SelectModal  type={"district"}  isLoading={isLoading} identifier={"name"} data={districtData}
                                         closeModal={closeModal} searchItem={searchDistrict} selectItem={selectDistrict}
            /> : null}
        </View>)
}

export default DistrictDropDown;

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