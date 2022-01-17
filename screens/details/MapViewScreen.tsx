import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Dimensions, Image, AppState, Alert} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import {SolidButtonBlue} from "../../buttons/Buttons";
import {useNavigation, useRoute} from "@react-navigation/native";
import * as Location from 'expo-location';
import * as IntentLauncher from "expo-intent-launcher";



export default function MapViewScreen() {

    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setIsLoading] = useState(true);

    const [location, setLocation] = useState({
        latitude: 28.644800,
        longitude: 77.216721,
        latitudeDelta: 0.0976,
        longitudeDelta: 0.056
    });

    useEffect(() => {
        (async () => {
            let locationEnabled = await Location.hasServicesEnabledAsync();
            if (!locationEnabled) {
                Alert.alert("Please turn on your location for this service");
                navigation.goBack();
            } else {
                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert("Permission to access location was denied");
                }
                let currentLocation = await Location.getCurrentPositionAsync({});
                let data = location;
                data.latitude = currentLocation.coords.latitude;
                data.longitude = currentLocation.coords.longitude;
                setLocation(data);
                setIsLoading(false);
            }
        })();
    }, []);

    const handleMapRegionChange = (data) => {
        setLocation(data);
    }

    const selectLocation = () => {
        if (route.params) {
            if (route.params.comingFrom === "profile") {
                navigation.navigate('Account', {location: location, comingFrom: "map"})
            } else if (route.params.comingFrom === "edit") {
                navigation.navigate('EditProfile', {location: location})
            }
        } else {
            navigation.navigate('AddressDetails', {location: location})
        }
    }

    return (
        <View style={style.container}>
            <View style={{paddingHorizontal: 24, paddingBottom: 10}}>
                <SecondaryHeader title={"Select Location"}/>
            </View>
            <MapView
                style={style.map}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: location.latitudeDelta,
                    longitudeDelta: location.longitudeDelta,
                }}
                onRegionChangeComplete={handleMapRegionChange}
            >
                <Marker
                    draggable
                    coordinate={{latitude: location.latitude, longitude: location.longitude}}
                    onDragEnd={(e) => {

                    }}
                >
                </Marker>
            </MapView>
            <View style={style.btnContainer}>
                <SolidButtonBlue ctaFunction={selectLocation} text={"Select Location"}/>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    btnContainer: {
        position: "absolute",
        bottom: 16,
        left: 16,
        width: Dimensions.get("window").width - 32
    }
});
