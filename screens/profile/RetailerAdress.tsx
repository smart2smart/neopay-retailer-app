import React, { useEffect, useState, } from 'react';
import { Text, View, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import { SolidButtonBlue } from "../../buttons/Buttons";
import StateDropDown from "../../modals/StateDropDown";
import DistrictDropDown from "../../modals/DistrictDropDown";
import LocationBox from "../../modals/LocationBox";
import InputBox from "./InputBox";
import CityDropDown from "../../modals/CityDropDown";
import LocalityDropDown from "../../modals/LocalityDropDown";
import PincodeDropDown from "../../modals/PincodeDropDown";


export default function RetailerAddress(props) {

    const [line1, setLine1] = useState("");
    const [line2, setLine2] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedLocation, setSelectedLocation] = useState({ latitude: 0, longitude: 0 });
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedPincode, setSelectedPincode] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedLocality, setSelectedLocality] = useState("");
    const [addressId, setAddressId] = useState("");


    const selectState = (state) => {
        setSelectedState(state);
        if (state.id != selectedState.id) {
            setSelectedDistrict("");
            setSelectedCity("");
            setSelectedPincode("");
            setSelectedLocality("");
        }
    }

    const selectDistrict = (district) => {
        setSelectedDistrict(district);
        if (selectedDistrict) {
            if (district.id != selectedDistrict.id) {
                setSelectedPincode("");
                setSelectedCity("");
                setSelectedLocality("");
            }
        }
    }


    const selectPincode = (pincode) => {
        setSelectedPincode(pincode);
        if (pincode.id != selectedPincode.id) {
            setSelectedCity("");
        }
    }

    const selectCity = (city) => {
        setSelectedCity(city);
        if (city.id != selectedCity.id) {
            setSelectedLocality("");
        }
    }

    const selectLocality = (locality) => {
        setSelectedLocality(locality);
    }

    const selectLocation = (location) => {
        setSelectedLocation(location);
    }

    useEffect(() => {
        if (props.data) {
            let data = JSON.parse(props.data?.address);
            setLine1(data.line_1);
            setLine2(data.line_2);
            setSelectedCity(data.city);
            setSelectedDistrict(data.district);
            setSelectedLocality(data.locality);
            setSelectedPincode(data.pincode);
            setSelectedState(data.state);
            setAddressId(data.id);
            if (data.latitude) {
                setSelectedLocation({
                    latitude: data.latitude,
                    longitude: data.longitude,
                })
            }
        }
    }, []);

    const saveData = () => {
        if (!selectedState) {
            Alert.alert("Please select state.")
            return;
        }
        if (!selectedDistrict) {
            Alert.alert("Please select district.")
            return;
        }
        if (!selectedPincode) {
            Alert.alert("Please select pincode.")
            return;
        }
        if (!selectedCity) {
            Alert.alert("Please select city.")
            return;
        }
        if (!selectedLocality) {
            Alert.alert("Please select locality.")
            return;
        }
        if (!line1) {
            Alert.alert("Please select line 1.")
            return;
        }
        let data = {
            address: JSON.stringify({
                line_1: line1,
                line_2: line2,
                locality: selectedLocality.id,
                district: selectedDistrict.id,
                pincode: selectedPincode.id,
                city: selectedCity.id,
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                state: selectedState.id
            })
        }
        props.saveData(data);
    }


    return (
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={{ paddingBottom: 100 }}>
                    <Text style={texts.darkGreyTextBold16}>
                        Address
                    </Text>
                    <LocationBox placeholder={"Select location"} selectLocation={selectLocation}
                        location={selectedLocation} />
                    {selectedLocation ? <StateDropDown location={selectedLocation} property={selectedState}
                        selectItem={selectState} /> : null}
                    {selectedState ? <DistrictDropDown state={selectedState} property={selectedDistrict}
                        selectItem={selectDistrict} /> : null}
                    {selectedDistrict ? <PincodeDropDown district={selectedDistrict} property={selectedPincode}
                        selectItem={selectPincode} /> : null}
                    {selectedPincode ? <CityDropDown state={selectedState} location={selectedLocation} property={selectedCity}
                        selectItem={selectCity} /> : null}
                    {selectedCity ?
                        <LocalityDropDown city={selectedCity} property={selectedLocality}
                            selectItem={selectLocality} /> : null}
                    {selectedLocality ? <InputBox title={"Address Line 1:"} placeholder={"Enter line 1"} value={line1}
                        setter={setLine1} /> : null}
                    {selectedLocality ?
                        <InputBox title={"Address Line 2 (Optional):"} placeholder={"Enter line 2"} value={line2}
                            setter={setLine2} /> : null}
                </View>
            </ScrollView>
            <View style={[commonStyles.row, { marginTop: 12 }]}>
                <SolidButtonBlue ctaFunction={saveData} text={"Save"} />
            </View>
        </KeyboardAvoidingView>
    )
}