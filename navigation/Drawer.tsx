import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import texts from "@texts";
import store from "../store/store";
import PersistenceStore from "@utils/PersistenceStore";
import BottomTabNavigator from "./BottomTabNavigator";
import colors from "@colors";
import mapStateToProps from "../store/mapStateToProps";
import { connect } from "react-redux";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "@screens/home/HomeScreen";
import SurveyList from "@screens/survey";

import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from "expo-notifications";
import * as Application from "expo-application";
import { PostRequest } from "@postRequest";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import { commonApi } from "@api";

const DrawerNavigator = createDrawerNavigator();

function Drawer() {
  return (
    <DrawerNavigator.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <DrawerNavigator.Screen
        key={"Home"}
        name={"Home"}
        component={BottomTabNavigator}
      />
      <DrawerNavigator.Screen
        key={"SurveyList"}
        name={"SurveyList"}
        component={SurveyList}
      />
    </DrawerNavigator.Navigator>
  );
}

export default connect(mapStateToProps, {})(Drawer);

const LogOut = () => {
  Alert.alert(
    "LogOut",
    "Are you sure you want to logout?",
    [
      {
        text: "Yes",
        onPress: () => {
          registerForPushNotificationsAsync({});
          store.dispatch({ type: "RESET_RETAILER" });
          PersistenceStore.removeTimeStamp();
          PersistenceStore.removeUserType();
          PersistenceStore.removeAccessToken();
          PersistenceStore.removeRefreshToken();
        },
      },
      { text: "No", onPress: () => {} },
    ],
    { cancelable: false }
  );
};

const openSettings = () => {
  IntentLauncher.startActivityAsync(
    IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
  );
};

const selectCurrentLocation = async () => {
  let data = { latitude: 0, longitude: 0 };
  let locationEnabled = await Location.hasServicesEnabledAsync();
  if (!locationEnabled) {
    Alert.alert(
      "Location Disabled",
      "Please turn on your location for this service",
      [
        {
          text: "Ok",
          onPress: () => {
            openSettings();
          },
        },
        {
          text: "Cancel",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  } else {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
    });

    data.latitude = currentLocation.coords.latitude;
    data.longitude = currentLocation.coords.longitude;
  }
  return data;
};

const registerForPushNotificationsAsync = async (retailer_data) => {
  try {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await getExpoPushTokenAsync()).data;
    const location = await selectCurrentLocation();
    let payload = {
      ...commonApi.setNotificationsToken,
      data: {
        device_id: Application.androidId,
        app_name: "retailer",
        token,
        ...location,
      },
    };
    if (retailer_data?.user) {
      payload = {
        ...payload,
        data: {
          ...payload.data,
          user: retailer_data?.user,
        },
      };
    }
    PostRequest(payload).then((res) => {
      if (res.status === 200) {
      }
    });


    if (Platform.OS === "android") {
      setNotificationChannelAsync("default", {
        name: "default",
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    setAppIsReady(true);
  } catch (err) {
    console.log(err);
  }
};

const RenderItem = (props) => (
  <TouchableOpacity style={styles.renderItem} onPress={props.onPress}>
    <Text style={texts.darkGreyTextBold14}>{props.title}</Text>
    <View>
      <Ionicons name="ios-arrow-forward" size={20} color={colors.darkGrey} />
    </View>
  </TouchableOpacity>
);

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const navigate = (screen: String) => {
    navigation.navigate(screen);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      showsVerticalScrollIndicator={false}
      style={styles.drawer}
      {...props}
    >
      <View style={styles.container}>
        <View>
          <View>
            <RenderItem
              title={"Home"}
              onPress={() => {
                navigate("Home");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Cart"}
              onPress={() => {
                navigate("Cart");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Orders"}
              onPress={() => {
                navigate("Orders");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Survey"}
              onPress={() => {
                navigate("SurveyList");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Profile"}
              onPress={() => {
                navigate("Account");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Logout"}
              onPress={() => {
                LogOut();
              }}
            />
          </View>
        </View>
        <View style={styles.version}>
          <Text style={texts.greyTextBold14}>
            Version - {Constants.manifest.version}
          </Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    height: Dimensions.get("window").height,
  },
  container: {
    height: Dimensions.get("window").height,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  renderItem: {
    borderBottomColor: "#bfbfbf",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  version: {
    borderTopColor: "#bfbfbf",
    borderTopWidth: 1,
    marginHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
