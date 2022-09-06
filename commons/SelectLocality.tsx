import React, {Component, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, ScrollView} from 'react-native';
import colors from "@colors";
import commonStyles from "@commonStyles";
import texts from "@texts";
import Icon from 'react-native-vector-icons/AntDesign';
import {BlueButtonMedium, BlueButtonSmall, BorderButtonSmallRed} from "@Buttons";


export default function SelectLocalityModal(props) {
    const [searchText, setSearchText] = useState('');
    // const [localityText, setLocalityText] = useState('');
    const [data, setData] = useState([]);
    const [addingNew, setAddingNew] = useState(false);

    useEffect(() => {
        setData(props.data);
    }, [props])

    const search = (text: string) => {
        props.searchItem(text);
        setSearchText(text);
    }

    // const addNewLocation = () => {
    //     props.selectItem(localityText);
    // }

    const close = ()=>{
        // setLocalityText('');
        // setAddingNew(false);
        setSearchText('');
        props.closeModal();
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
                <View style={commonStyles.modalDiv}>
                <View style={commonStyles.modalCloseIconDiv}>
                    <TouchableOpacity onPress={() => {
                        close()
                    }} style={commonStyles.modalCloseIcon}>
                        <Icon name="close" size={24} color={colors.black}/>
                    </TouchableOpacity>
                </View>
                {addingNew && data.length==0?null:<View style={commonStyles.modalTextInputContainer}>
                    <TextInput
                        value={searchText}
                        maxLength={10}
                        placeholder={"Search locality and tap to select..."}
                        onChangeText={(text) => search(text)}
                        style={[commonStyles.modalTextInput, texts.darkGreyNormal14]}>
                    </TextInput>
                </View>}
                {data.length > 0 ?
                        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                            <View style={commonStyles.modalBeatPlanContainer}>
                                <Text style={[texts.darkGreyTextBold16]}>
                                    Tap to select:
                                </Text>
                                {data && data.map((item) => {
                                    return (
                                        <TouchableOpacity key={item.id + item.name} onPress={() => {
                                            setSearchText("")
                                            props.selectItem(item)
                                        }} style={commonStyles.modalBeatPlanDiv}>
                                            <Text style={texts.greyTextBold14}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </ScrollView>
                    : null}
                {/*{data.length === 0 && !addingNew ? <View style={{alignItems: 'center'}}>*/}
                {/*    <Text style={[texts.blackTextBold18, {marginTop: 200, marginBottom: 30, textAlign: 'center'}]}>*/}
                {/*        Locality not available*/}
                {/*    </Text>*/}
                {/*    <View>*/}
                {/*        <BlueButtonMedium ctaFunction={() => {*/}
                {/*            setAddingNew(true);*/}
                {/*        }} text={"Add New"}>*/}
                {/*        </BlueButtonMedium>*/}
                {/*    </View>*/}
                {/*</View> : null}*/}
                {/*{addingNew ? <View style={{flex:1}}>*/}
                {/*    <View>*/}
                {/*        <TextInput*/}
                {/*            placeholder={"Enter locality"}*/}
                {/*            onChangeText={(text) => setLocalityText(text)}*/}
                {/*            value={localityText}*/}
                {/*            multiline={true}*/}
                {/*            numberOfLines={5}*/}
                {/*            textAlignVertical={"top"}*/}
                {/*            style={styles.localityTextInput}>*/}
                {/*        </TextInput>*/}
                {/*    </View>*/}
                {/*    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop:30}}>*/}
                {/*        <BorderButtonSmallRed ctaFunction={close} text={"Cancel"}/>*/}
                {/*        <View style={{marginLeft: 16}}>*/}
                {/*            <BlueButtonSmall ctaFunction={addNewLocation} text={"Add"}/>*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*</View> : null}*/}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    localityTextInput: {
        borderWidth:1,
        borderColor:colors.grey,
        borderRadius:5,
        padding:10,
        marginTop:20
    }
})