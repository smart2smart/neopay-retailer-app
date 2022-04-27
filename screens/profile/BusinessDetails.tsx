import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {useRoute} from "@react-navigation/native";
import texts from "../../styles/texts";
import InputBox from "./InputBox";
import commonStyles from "../../styles/commonStyles";
import {SolidButtonBlue} from "../../buttons/Buttons";


export default function BusinessDetails(props) {
    const route = useRoute();
    const [gst, setGst] = useState("");
    const [pan, setPan] = useState("");

    const saveData = () => {
        let data = {
            gst_number: gst,
            pan_no: pan
        }
        props.saveData(data);
    }

    useEffect(() => {
        if (props.data) {
            setGst(props.data.gst_number);
            setPan(props.data.pan_no);
        }

    }, [])

    return (
        <View style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                <Text style={texts.darkGreyTextBold16}>
                    Business Details
                </Text>
                <InputBox title={"GSTIN No.:"} placeholder={"Enter gst number"} value={gst}
                          setter={setGst}/>
                <InputBox title={"PAN No.:"} placeholder={"Enter pan number"} value={pan}
                          setter={setPan}/>
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
