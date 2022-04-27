import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import texts from "../../styles/texts";
import InputBox from "./InputBox";
import commonStyles from "../../styles/commonStyles";
import {SolidButtonBlue} from "../../buttons/Buttons";
import {commonApi} from "../../api/api";
import {connect, useSelector} from 'react-redux';
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import SelectBeatModal from "../../commons/SelectBeatModal";
import DropDown from "./DropDown";


export default function AddStoreDetails(props) {
    const [shopName, setShopName] = useState("");
    const [contactPersonName, setContactPersonName] = useState("");
    const [mobile, setMobile] = useState("");
    const [beatModalVisible, setBeatModalVisible] = useState(false);
    const [selectedBeat, setSelectedBeat] = useState(false);
    const [beatData, setBeatData] = useState({mapped: [], all: []});
    const distributorId = useSelector((state: any) => state.distributor.distributorId);
    const salesman = useSelector((state: any) => state.salesman);

    const saveData = () => {
        let data = {name: shopName, contact_person_name: contactPersonName, contact_no: mobile}
        if (selectedBeat) {
            data["beat_id"] = selectedBeat.id
        }
        props.saveData(data);
    }

    const getBeatList = () => {
        const data = {
            method: commonApi.getBeatPlanList.method,
            url: commonApi.getBeatPlanList.url + "?distributor_id=" + distributorId,
            header: commonApi.getBeatPlanList.header
        }
        AuthenticatedGetRequest(data).then((res) => {
            if (res.status == 200) {
                let data = {mapped: [], all: []}
                res.data.forEach((item) => {
                    if (item.salesman == salesman.id) {
                        data.mapped.push(item)
                    } else {
                        data.all.push(item)
                    }
                })
                setBeatData(data);
            }
        })
    }

    useEffect(() => {
        if (props.data) {
            setContactPersonName(props.data.contact_person_name);
            setMobile(props.data.contact_no);
            setShopName(props.data.name);
            if (props.data.beat_data) {
                setSelectedBeat({
                    id: props.data.beat_data["beat__id"],
                    name: props.data.beat_data["beat__name"]
                })
            }
        }
        getBeatList();
    }, []);

    const selectBeat = (beat) => {
        setSelectedBeat(beat);
        setBeatModalVisible(false);
    }

    const searchBeat = () => {

    }

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
                <InputBox title={"Phone Number:"} placeholder={"Enter phone number"} value={mobile}
                          setter={setMobile}/>
                <DropDown popup={true} property={selectedBeat} toggleModal={setBeatModalVisible} onPress={() => {
                    setBeatModalVisible(true)
                }}
                          modal={SelectBeatModal} title={"Beat"} modalVisible={beatModalVisible}
                          data={beatData} selectItem={selectBeat} searchItem={searchBeat}
                          searchType={"api"} header={"Beat:"} placeholder={"Select beat"}
                />
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
