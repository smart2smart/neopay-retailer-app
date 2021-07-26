import React, {Component, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView} from 'react-native';
import colors from "../assets/colors/colors";
import commonStyles from "../styles/commonStyles";
import texts from "../styles/texts";
import Icon from 'react-native-vector-icons/AntDesign';


export default function SelectBeatModal(props) {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState({mapped: [], all: []});
    const [originalData, setOriginalData] = useState({mapped: [], all: []});

    useEffect(() => {
        setData(props.data);
        setOriginalData(props.data);
    }, [props])

    const searchBeat = (text: string) => {
        if (text === '') {
            setData(originalData);
        } else {
            let {mapped, all} = originalData;
            let filteredMapped = mapped.filter((item) => {
                return item.name.toLowerCase().includes(text.toLowerCase());
            })
            let filteredAll = all.filter((item) => {
                return item.name.toLowerCase().includes(text.toLowerCase());
            })
            setData({mapped: filteredMapped, all: filteredAll});
        }
        setSearchText(text);
    }
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                setSearchText('');
                props.closeModal();
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.closeIconDiv}>
                    <TouchableOpacity onPress={() => {
                        props.closeModal();
                    }} style={styles.closeIcon}>
                        <Icon name="close" size={24} color={colors.black}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.textInputContainer}>
                    <TextInput
                        value={searchText}
                        maxLength={10}
                        placeholder={"Search beat and tap to select..."}
                        onChangeText={(text) => searchBeat(text)}
                        style={[commonStyles.modalTextInput, texts.darkGreyNormal14]}>
                    </TextInput>
                </View>
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <View style={styles.beatPlanContainer}>
                        <Text style={[texts.darkGreyTextBold16]}>
                            Your Beats:
                        </Text>
                        {data && data.mapped.map((item) => {
                            return (
                                <TouchableOpacity key={item.id+item.name} onPress={() => {
                                    props.selectItem(item)
                                }} style={styles.beatPlanDiv}>
                                    <Text style={texts.greyTextBold14}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                        {data && data.mapped.length===0?<Text style={[texts.blackTextBold16,{marginTop:10}]}>
                            No beats available
                        </Text>:null}
                        <Text style={[texts.darkGreyTextBold16, {marginTop: 30}]}>
                            All Beats:
                        </Text>
                        {data && data.all.map((item) => {
                            return (
                                <TouchableOpacity key={item.id+item.name} onPress={() => {
                                    props.selectItem(item)
                                }} style={styles.beatPlanDiv}>
                                    <Text style={texts.greyTextBold14}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                        {data && data.all.length===0?<Text style={[texts.blackTextBold16,{marginTop:10}]}>
                            No beats available
                        </Text>:null}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: colors.white,
        padding: 24
    },
    textInputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        padding: 0
    },
    beatPlanDiv: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey,
        paddingLeft: 5
    },
    beatPlanContainer: {
        paddingVertical: 30
    },
    closeIconDiv: {
        alignItems: 'flex-end'
    },
    closeIcon: {
        paddingLeft: 10,
        paddingBottom: 10
    }
})