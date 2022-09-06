import {Dimensions, StyleSheet, Text, View} from "react-native";
import texts from "@texts";
import React, {useEffect, useState} from "react";
import {DropDownLayout} from "./DropDownLayout";
import SelectModal from "./SelectModal";
import {commonApi} from "@api";
import {AuthenticatedGetRequest} from "@authenticatedGetRequest";
import {GetRequest} from "@getRequest";
import {useRoute} from "@react-navigation/native";
import colors from "@colors";


const StateDropDown = (props) => {

    const getStatesFromGoogleGeoCodeAPi = () => {
        let location = props.location;
        if (location.latitude != 0) {
            let url = "https://maps.googleapis.com/maps/api/geocode/json?"
            url += "latlng=" + location.latitude + "," + location.longitude
            url += "&key=AIzaSyBbUqN1rjGDkZx8vxPJeQKnMK5I24j0Fls"
            let data = {
                method: "GET",
                url: url,
                header: commonApi.getStateList.header
            }
            GetRequest(data).then((res) => {
                let state = res.data.results[0]["address_components"].forEach((item)=>{
                    if(item["types"][0]=="administrative_area_level_1"){
                        getStateData(item["long_name"])
                    }
                })
            })
        }else{
            getStateData(null)
        }
    }


    const [stateData, setStateData] = useState([]);
    const [originalStateData, setOriginalStateData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const route = useRoute();

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    useEffect(() => {
        getStatesFromGoogleGeoCodeAPi();
    }, [props.location]);

    const searchState = (text) => {
        if (text != "") {
            let data = originalStateData.filter((item) => {
                return item.name.toLowerCase().includes(text.toLowerCase())
            })
            setStateData(data)
        } else {
            setStateData(originalStateData);
        }
    }

    const selectState = (item) => {
        props.selectItem(item);
        closeModal();
    }

    const getStateData = (stateName) => {
        const data = {
            method: commonApi.getStateList.method,
            url: commonApi.getStateList.url,
            header: commonApi.getStateList.header
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                setStateData(res.data);
                setOriginalStateData(res.data);
                if(stateName){
                    res.data.forEach((item)=>{
                        if(item.name == stateName){
                            props.selectItem(item);
                        }
                    })
                }
            }
        })
    }

    return (
        <View>
            <Text style={[texts.redTextBold12, {paddingTop: 20}]}>
                {"State:"}
            </Text>
            <DropDownLayout onPress={openModal} placeholder={"Select state"} property={props.property}/>
            {modalVisible ? <SelectModal  type={"state"}  identifier={"name"} data={stateData}
                                         closeModal={closeModal} searchItem={searchState} selectItem={selectState}
            /> : null}
        </View>)
}

export default StateDropDown;

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