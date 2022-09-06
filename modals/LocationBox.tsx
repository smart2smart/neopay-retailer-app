import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import texts from "@texts";
import commonStyles from "@commonStyles";
import React, {useState} from "react";
import colors from "@colors";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import MapViewModal from "@screens/profile/MapViewModal";

const LocationBox = (props) => {

    const [locationModalVisible, setLocationModalVisible] = useState(false);

    const openSettings = () => {
        IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS);
    }

    const selectCurrentLocation = async () => {
        let locationEnabled = await Location.hasServicesEnabledAsync();
        if (!locationEnabled) {
            Alert.alert(
                'Location Disabled',
                'Please turn on your location for this service',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            openSettings()
                        },
                    },
                    {
                        text: 'Cancel', onPress: () => {
                        }
                    },
                ],
                {cancelable: false},
            );
        } else {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission to access location was denied");
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({});
            let data = {};
            data.latitude = currentLocation.coords.latitude;
            data.longitude = currentLocation.coords.longitude;
            props.selectLocation(data);
        }
    }

    const openModal = ()=>{
        setLocationModalVisible(true);
    }

    return (<View>
        <Text style={[texts.redTextBold12, {paddingTop: 20}]}>
            Location
        </Text>
        <View style={[style.textInput, commonStyles.rowSpaceBetween]}>
            <Text style={[texts.greyTextBold14]}>
                {props.location ? parseFloat(props.location.latitude).toFixed(5) + ", " +
                    parseFloat(props.location.longitude).toFixed(5) : props.placeholder}
            </Text>
        </View>
        <View style={{marginTop: 8}}>
            <View style={commonStyles.rowSpaceBetween}>
                <TouchableOpacity onPress={selectCurrentLocation} style={style.mapButton}>
                    <Text style={[texts.whiteTextBold12]}>
                        Set Current Location
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openModal} style={style.mapButton}>
                    <Text style={[texts.whiteTextBold12]}>
                        Choose on Map
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        {locationModalVisible ?
            <MapViewModal
                currentLocation={props.location}
                selectLocation={props.selectLocation}
                closeModal={() => {
                    setLocationModalVisible(false);
                }}/> : null}
    </View>)
}

export default LocationBox;

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    textInput: {
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.grey,
        paddingLeft: 10,
        height: 36
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    },
    mapButton: {
        backgroundColor: colors.red,
        borderRadius: 2,
        paddingVertical: 6,
        paddingHorizontal: 12
    }
});
