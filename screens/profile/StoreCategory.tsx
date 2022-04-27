import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import {SolidButtonBlue} from "../../buttons/Buttons";
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import MetaDataModal from "../../commons/MetaDataModal";
import {useRoute} from "@react-navigation/native";
import DropDown from "./DropDown";

export default function StoreCategory(props) {
    const route = useRoute();
    const [selectedStoreArea, setSelectedStoreArea] = useState("");
    const [selectedTurnOver, setSelectedTurnOver] = useState("");
    const [selectedStoreType, setSelectedStoreType] = useState('');
    const [storeTypeModalVisible, setStoreTypeModalVisible] = useState(false);
    const [metData, setMetaData] = useState({store_types: []});
    const [selectedShopFormat, setSelectedShopFormat] = useState('');
    const [shopFormatModalVisible, setShopFormatModalVisible] = useState(false);
    const [storeAreaModalVisible, setStoreAreaModalVisible] = useState(false);
    const [turnOverModalVisible, setTurnOverModalVisible] = useState(false);

    useEffect(() => {
        getMetaData();
        if (props.data) {
            if (props.data.store_type) {
                setSelectedStoreType({key: props.data.store_type})
            }
            if (props.data.format_type) {
                setSelectedShopFormat({key: props.data.format_type})
            }
            if (props.data.store_area) {
                setSelectedStoreArea({key: props.data.store_area})
            }
            if (props.data.turn_over) {
                setSelectedTurnOver({key: props.data.turn_over})
            }
        }
    }, [])

    const getMetaData = () => {
        const data = {
            method: commonApi.getRetailerMetaData.method,
            url: commonApi.getRetailerMetaData.url,
            header: commonApi.getRetailerMetaData.header
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                let retailerData = props.data;
                let data = res.data
                if (retailerData) {
                    if (retailerData.store_type) {
                        data.store_types.forEach((item) => {
                            if (item.key == retailerData.store_type) {
                                setSelectedStoreType({key: item.key, name: item.value})
                            }
                        })
                    }
                    if (retailerData.format_type) {
                        data.format_types.forEach((item) => {
                            if (item.key == retailerData.format_type) {
                                setSelectedShopFormat({key: item.key, name: item.value})
                            }
                        })
                    }
                    if (retailerData.store_area) {
                        data.area_choices.forEach((item) => {
                            if (item.key == retailerData.store_area) {
                                setSelectedStoreArea({key: item.key, name: item.value})
                            }
                        })
                    }

                    if (retailerData.turn_over) {
                        data.turn_over_choices.forEach((item) => {
                            if (item.key == retailerData.turn_over) {
                                setSelectedTurnOver({key: item.key, name: item.value})
                            }
                        })
                    }
                }
            }
            setMetaData(res.data)
        })
    }

    const selectStoreType = (item) => {
        setStoreTypeModalVisible(false);
        setSelectedStoreType({key: item.key, name: item.value});
    }

    const selectShopFormat = (item) => {
        setShopFormatModalVisible(false);
        setSelectedShopFormat({key: item.key, name: item.value})
    }

    const selectStoreArea = (item) => {
        setStoreAreaModalVisible(false)
        setSelectedStoreArea({key: item.key, name: item.value})
    }

    const selectTurnOver = (item) => {
        setTurnOverModalVisible(false);
        setSelectedTurnOver({key: item.key, name: item.value})
    }

    const saveData = () => {
        let data = {
            store_type: selectedStoreType.key,
            format_type: selectedShopFormat.key,
            store_area: selectedStoreArea.key,
            turn_over: selectedTurnOver.key
        }
        props.saveData(data);
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                <Text style={texts.darkGreyTextBold16}>
                    Store Category
                </Text>
                <DropDown popup={true} property={selectedStoreType} toggleModal={setStoreTypeModalVisible}
                          modal={MetaDataModal} title={"Store Type"} modalVisible={storeTypeModalVisible}
                          data={metData.store_types}
                          onPress={() => {
                              setStoreTypeModalVisible(true)
                          }}
                          selectItem={selectStoreType} header={"Type of store:"} placeholder={"Select store type"}/>
                <DropDown popup={true} property={selectedShopFormat} toggleModal={setShopFormatModalVisible}
                          modal={MetaDataModal}
                          title={"Shop Format"} modalVisible={shopFormatModalVisible} data={metData.format_types}
                          onPress={() => {
                              setShopFormatModalVisible(true)
                          }}
                          selectItem={selectShopFormat} header={"Format:"} placeholder={"Select store format"}/>
                <DropDown popup={true} property={selectedStoreArea} toggleModal={setStoreAreaModalVisible}
                          modal={MetaDataModal}
                          modalVisible={storeAreaModalVisible} data={metData.area_choices}
                          onPress={() => {
                              setStoreAreaModalVisible(true)
                          }}
                          selectItem={selectStoreArea} header={"Area of store:"} placeholder={"Select store area"}/>
                <DropDown popup={true} property={selectedTurnOver} toggleModal={setTurnOverModalVisible}
                          modal={MetaDataModal}
                          modalVisible={turnOverModalVisible} data={metData.turn_over_choices}
                          onPress={() => {
                              setTurnOverModalVisible(true)
                          }}
                          selectItem={selectTurnOver} header={"Turnover:"} placeholder={"Select store turnover"}/>
            </ScrollView>
            <View style={[commonStyles.row, {marginTop: 12}]}>
                <SolidButtonBlue ctaFunction={saveData} text={"Save"}/>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    }
});
