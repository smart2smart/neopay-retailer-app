import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    TextInput,
    ScrollView,
    FlatList
} from 'react-native';
import colors from "../../assets/colors/colors";
import Icon from 'react-native-vector-icons/AntDesign';


export default function SeeAllCompaniesModal(props) {
    const [data, setData] = useState({mapped: [], all: []});

    useEffect(() => {
        setData(props.data);

    }, [props])


    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.closeModal(props.type);
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.closeIconDiv}>
                    <TouchableOpacity onPress={() => {
                        props.closeModal(props.type);
                    }} style={styles.closeIcon}>
                        <Icon name="close" size={24} color={colors.black}/>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    ItemSeparatorComponent={() => <View style={{height: 16}}></View>}
                    keyExtractor={(item, index) => item.id + index + ""}
                    renderItem={(item) => props.renderItem(item, props)}/>
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
    closeIconDiv: {
        alignItems: 'flex-end'
    },
    closeIcon: {
        paddingLeft: 10,
        paddingBottom: 10
    }
})