import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native';
import SecondaryHeader from "../headers/SecondaryHeader";
import MapView from 'react-native-maps';
// import * as Location from 'expo-location';
import {Marker} from 'react-native-maps';
import {SolidButtonBlue} from "../buttons/Buttons";
import {useNavigation, useRoute} from "@react-navigation/native";
import Indicator from "../utils/Indicator";
import {commonApi} from "../api/api";
import {AuthenticatedPostRequest} from "../api/authenticatedPostRequest";


export default function MapViewScreen() {

    const navigation = useNavigation();
    const route = useRoute();

    const [addressId, setAddressId] = useState('');
    const [retailerId, setRetailerId] = useState('');

    const [loading, setIsLoading] = useState(true);
    const [location, setLocation] = useState({
        latitude: 28.644800,
        longitude: 77.216721,
        latitudeDelta: 0.0976,
        longitudeDelta: 0.056
    });

    useEffect(() => {
        // setAddressId(route.params.addressId);
        // setRetailerId(route.params.retailerId);
        (async () => {
            let {status} = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({});
            let data = location;
            data.latitude = currentLocation.coords.latitude;
            data.longitude = currentLocation.coords.longitude;
            setLocation(data);
            setIsLoading(false);
        })();
    }, []);

    const handleMapRegionChange = (data) => {
        setLocation(data);
    }

    const selectLocation = () => {
        const data = {
            latitude:location.latitude,
            longitude:location.longitude
        }
        const dataToSend = {
            method: commonApi.updateRetailerSetLocation.method,
            url: commonApi.updateRetailerSetLocation.url+addressId+'/',
            header: commonApi.updateRetailerSetLocation.header,
            data: data
        }
        AuthenticatedPostRequest(dataToSend).then((res) => {
            setIsLoading(false);
            if (res.status == 200) {
                if(route.params.comingFrom==='edit-profile'){
                    navigation.navigate('EditRetailer', {location:location})
                }else {
                    navigation.replace('UploadImage', {retailerId: retailerId, image: '', comingFrom: 'add-retailer'});
                }
            }
        })
    }

    return (
        <View style={style.container}>
            <View style={{paddingHorizontal: 24, paddingBottom: 10}}>
                <SecondaryHeader title={"Select Location"}/>
            </View>
            <Indicator isLoading={loading}/>
            {!loading ? <MapView
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
            </MapView> : null}
            <View style={style.btnContainer}>
                {/* <SolidButtonBlue ctaFunction={selectLocation} text={"Select Location"}/> */}
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
