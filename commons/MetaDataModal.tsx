import React, {Component, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView} from 'react-native';
import commonStyles from "../styles/commonStyles";
import texts from "../styles/texts";
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../assets/colors/colors';


export default function MetaDataModal(props) {

    const [data, setData] = useState([]);

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
            <View style={commonStyles.modalContainer}>
                <View style={commonStyles.modalDiv}>
                    <View style={commonStyles.modalCloseIconDiv}>
                        <TouchableOpacity onPress={() => {
                            props.closeModal();
                        }} style={commonStyles.modalCloseIcon}>
                            <Icon name="close" size={24} color={colors.black}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                        <View style={commonStyles.modalBeatPlanContainer}>
                            <Text style={[texts.darkGreyTextBold16]}>
                                Tap to select:
                            </Text>
                            {data && data.map((item) => {
                                return (
                                    <TouchableOpacity key={item.key} onPress={() => {
                                        props.selectItem(item)
                                    }} style={commonStyles.modalBeatPlanDiv}>
                                        <Text style={texts.greyTextBold14}>
                                            {item.value}
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