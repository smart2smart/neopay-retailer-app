import React, { Component, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import colors from "../assets/colors/colors";
import commonStyles from "../styles/commonStyles";
import texts from "../styles/texts";
import Icon from 'react-native-vector-icons/AntDesign';
import Indicator from "../utils/Indicator";


export default function SelectModal(props) {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");

    const search = (text) => {
        setSearchText(text);
        props.searchItem(text);
    }

    useEffect(() => {
        setData(props.data);
    }, [props])

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.closeModal();
            }}
        >
            <View style={[commonStyles.modalContainer, {}]}>
                <Indicator isLoading={props.isLoading} />
                <View style={commonStyles.modalDiv}>
                    <View style={commonStyles.modalCloseIconDiv}>
                        <TouchableOpacity onPress={() => {
                            props.closeModal();
                        }} style={commonStyles.modalCloseIcon}>
                            <Icon name="close" size={24} color={colors.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={[commonStyles.modalTextInputContainer]}>
                        <TextInput
                            value={searchText}
                            placeholder={`Search ${props.type} and tap to select...`}
                            onChangeText={(text) => search(text)}
                            style={[commonStyles.modalTextInput, texts.darkGreyNormal14]}>
                        </TextInput>
                    </View>

                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={[commonStyles.modalBeatPlanContainer]}>
                            <Text style={[texts.darkGreyTextBold16]}>
                                Tap to select:
                            </Text>
                            {data && data.map((item) => {
                                return (
                                    <TouchableOpacity key={item.id + ""} onPress={() => {
                                        props.selectItem(item)
                                    }} style={commonStyles.modalBeatPlanDiv}>
                                        <Text style={[texts.darkGreyNormal14]}>
                                            {item[props.identifier]}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}