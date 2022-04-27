import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AddStoreDetails from "./AddStroeDetails";
import RetailerAddress from "./RetailerAdress";
import BusinessDetails from "./BusinessDetails";
import colors from '../../assets/colors/colors';


export default function RetailerDataModal(props) {

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.closeModal();
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.container}>
                    <View style={styles.closeIconDiv}>
                        <TouchableOpacity onPress={() => {
                            props.closeModal();
                        }} style={styles.closeIcon}>
                            <Icon name="close" size={24} color={colors.black}/>
                        </TouchableOpacity>
                    </View>

                    {props.selectedTab === "storeDetails" ?
                        <AddStoreDetails data={props.data} saveData={props.saveData}/> : null}
                    {props.selectedTab === "address" ?
                        <RetailerAddress data={props.data} saveData={props.saveData}/> : null}
                    {props.selectedTab === "businessDetails" ?
                        <BusinessDetails data={props.data} saveData={props.saveData}/> : null}
                </View>
            </View>
        </Modal>
    )
}

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
    textInput: {
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.grey,
        paddingLeft: 10,
        height: 36
    },
    editIcon: {
        backgroundColor: "#f6ebf0",
        width: 24,
        height: 24,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    }
})