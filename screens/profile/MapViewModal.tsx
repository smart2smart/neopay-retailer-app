import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, Alert, AppState} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import {Marker} from 'react-native-maps';
import {SolidButtonBlue} from "../../buttons/Buttons";
import Indicator from "../../utils/Indicator";
import {AntDesign} from "@expo/vector-icons";
import texts from "../../styles/texts";
import {useNavigation} from "@react-navigation/native";
import * as IntentLauncher from "expo-intent-launcher";
import colors from '../../assets/colors/colors';


export default function MapViewModal(props) {

    const [loading, setIsLoading] = useState(true);
    const [location, setLocation] = useState({
        latitude: 28.644800,
        longitude: 77.216721,
        latitudeDelta: 0.0976,
        longitudeDelta: 0.056
    });
    const appState = useRef(AppState.currentState);

    const openSettings = ()=>{
        IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS);
    }

    const _handleAppStateChange = nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            getLocation();
        }
        appState.current = nextAppState;
    };

    useEffect(()=>{
        AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, [])

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = ()=>{
        (async () => {
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
                        {text: 'Cancel', onPress: () => {
                                props.closeModal();
                            }},
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
                let data = location;
                if(props.currentLocation){
                    data.latitude = props.currentLocation.latitude;
                    data.longitude = props.currentLocation.longitude;
                }else{
                    data.latitude = currentLocation.coords.latitude;
                    data.longitude = currentLocation.coords.longitude;
                }
                setLocation(data);
                setIsLoading(false);
            }
        })();
    }

    const handleMapRegionChange = (data) => {
        setLocation(data);
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
        <View style={style.container}>
            <View style={{paddingHorizontal: 24, paddingBottom: 10}}>
                <View style={style.headerContainer}>
                    <TouchableOpacity onPress={() => {
                        props.closeModal()
                    }}>
                        <AntDesign name="arrowleft" size={24} color={colors.red}/>
                    </TouchableOpacity>
                    <Text style={[texts.greyTextBold16, {marginLeft:10}]}>
                        Select Location
                    </Text>
                </View>
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
                <SolidButtonBlue ctaFunction={()=>{
                    props.selectLocation(location);
                    props.closeModal();
                }} text={"Select Location"}/>
            </View>
        </View>
        </Modal>
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
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 20
    },
});
