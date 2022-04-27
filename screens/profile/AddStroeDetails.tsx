import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import texts from "../../styles/texts";
import InputBox from "./InputBox";
import commonStyles from "../../styles/commonStyles";
import {SolidButtonBlue} from "../../buttons/Buttons";

export default function AddStoreDetails(props) {
    const [shopName, setShopName] = useState("");
    const [contactPersonName, setContactPersonName] = useState("");
    const [email, setEmail] = useState("");

    const saveData = () => {
        let data = {name: shopName, contact_person_name: contactPersonName, email: email}
        props.saveData(data);
    }

    useEffect(() => {
        if (props.data) {
            setContactPersonName(props.data.contact_person_name);
            setEmail(props.data.email);
            setShopName(props.data.name);
        }
    }, []);

    return (
        <View style={style.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={texts.darkGreyTextBold16}>
                    Store Details
                </Text>
                <InputBox title={"Shop Name:"} placeholder={"Enter shop name"} value={shopName}
                          setter={setShopName}/>
                <InputBox title={"Contact Person:"} placeholder={"Enter contact person name"} value={contactPersonName}
                          setter={setContactPersonName}/>
                <InputBox title={"Phone Number:"} placeholder={"Enter phone number"} value={email}
                          setter={setEmail}/>
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
    }
});
