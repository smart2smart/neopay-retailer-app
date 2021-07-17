import React, {Component, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView} from 'react-native';
import colors from "../assets/colors/colors";
import commonStyles from "../styles/commonStyles";
import texts from "../styles/texts";
import Icon from 'react-native-vector-icons/AntDesign';


export default function SelectModal(props) {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    useEffect(() => {
        setData(props.data);
        setOriginalData(props.data);
    }, [props])

    const search = (text: string) => {
        if(text===''){
            setData(originalData);
        }else {
            let filteredData = originalData.filter((item)=>{
                return item.pincode.toLowerCase().includes(text.toLowerCase());
            });
            setData(filteredData);
        }
        setSearchText(text);
    }
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
                <View style={commonStyles.modalCloseIconDiv}>
                    <TouchableOpacity onPress={() => {
                        setSearchText('');
                        props.closeModal();
                    }} style={commonStyles.modalCloseIcon}>
                        <Icon name="close" size={24} color={colors.black}/>
                    </TouchableOpacity>
                </View>
                <View style={commonStyles.modalTextInputContainer}>
                    <TextInput
                        value={searchText}
                        maxLength={10}
                        placeholder={"Search pincode and tap to select..."}
                        onChangeText={(text) => search(text)}
                        style={[commonStyles.modalTextInput, texts.darkGreyNormal14]}>
                    </TextInput>
                </View>
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <View style={commonStyles.modalBeatPlanContainer}>
                        <Text style={[texts.darkGreyTextBold16]}>
                            Tap to select:
                        </Text>
                        {data && data.map((item) => {
                            return (
                                <TouchableOpacity key={item.id+item.pincode} onPress={() => {
                                    props.selectItem(item)
                                }} style={commonStyles.modalBeatPlanDiv}>
                                    <Text style={texts.greyTextBold14}>
                                        {item.pincode}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}