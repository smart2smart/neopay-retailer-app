import {Dimensions, StyleSheet, Text, View} from "react-native";
import texts from "../styles/texts";
import React, {useEffect, useState} from "react";
import {DropDownLayout} from "./DropDownLayout";
import SelectModal from "./SelectModal";
import {commonApi} from "../api/api";
import {AuthenticatedGetRequest} from "../api/authenticatedGetRequest";
import colors from "../assets/colors/colors";

let timeout: any = null;


const CityDropDown = (props) => {

    const [cityData, setCityData] = useState([]);
    const [originalCityData, setOriginalCityData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    useEffect(() => {
        getCityData()
    }, [props.state]);

    const searchCity = (text) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (text != "") {
                let data = originalCityData.filter((item) => {
                    return item.name.toLowerCase().includes(text.toLowerCase())
                })
                if (data.length == 0) {
                    getCityFromSearch(text);
                } else {
                    setCityData(data)
                }
            } else {
                setCityData(originalCityData);
            }
        },800)
    }

    const getCityFromSearch = (text)=>{
        const data = {
            method: commonApi.getCityList.method,
            url: commonApi.getCityList.url + "?search=" + text,
            header: commonApi.getCityList.header
        }
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                setCityData(res.data);
            }
        })
    }

    const selectCity = (item) => {
        props.selectItem(item);
        closeModal();
    }

    //get city from state and coordinates
    const getCityData = () => {
        let {latitude, longitude} = props.location;
        const data = {
            method: commonApi.getCityList.method,
            url: commonApi.getCityList.url + "?entity_type=city&state=" + props.state.id + "&latitude=" + latitude + "&longitude=" + longitude,
            header: commonApi.getCityList.header
        }
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                setCityData(res.data);
                setOriginalCityData(res.data);
            }
        })
    }

    return (
        <View>
            <Text style={[texts.redTextBold12, {paddingTop: 20}]}>
                {"City:"}
            </Text>
            <DropDownLayout onPress={openModal} placeholder={"Select city"} property={props.property}/>
            {modalVisible ? <SelectModal  type={"city"}  isLoading={isLoading} identifier={"name"} data={cityData}
                                         closeModal={closeModal} searchItem={searchCity} selectItem={selectCity}
            /> : null}
        </View>)
}

export default CityDropDown;

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