import React, { useState, useEffect, useCallback } from "react";
import useColorScheme from "../hooks/useColorScheme";
import { checkTokenFromStorage } from "@checkToken";
import Navigation from "./index";
import AuthStack, { VersionStack } from "./AuthStack";
import mapStateToProps from "../store/mapStateToProps";
import { setExpoTokens, setLandingScreen, setTokens } from "../actions/actions";
import { connect, useDispatch, useSelector } from "react-redux";
import { SafeAreaView, Alert } from "react-native";
import PersistenceStore from "@utils/PersistenceStore";
import * as Updates from "expo-updates";
import * as SplashScreen from "expo-splash-screen";
import { commonApi } from "@api";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from "expo-notifications";
import * as Analytics from "expo-firebase-analytics";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { PostRequest } from "@postRequest";
import store from "../store/store";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function Routes(props: any) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const retailerData = useSelector((state: any) => state.retailerDetails);
  const [loading, setLoading] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);
  const [forceUpdateFromPlayStore, setForceUpdateFromPlayStore] =
    useState(false);

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

  const getUserDetails = async () => {
    let tokens = await checkTokenFromStorage();
    if (tokens) {
      let initialScreen = await PersistenceStore.getLandingScreen();
      props.setLandingScreen(initialScreen);
      props.setLandingScreen(initialScreen);
      let user_type = await PersistenceStore.getUserType();
      if (user_type) {
        if (user_type == 2) {
          distributorDetails();
        } else if (user_type == 3) {
          retailerDetails();
        } else {
          Alert.alert("Not Access for this User.");
        }
      }
    } else {
      registerForPushNotificationsAsync();
    }
    checkForUpdates();
    setLoading(false);
  };

  const retailerDetails = () => {
    const data = {
      method: commonApi.getRetailerDetails.method,
      url: commonApi.getRetailerDetails.url,
      header: commonApi.getRetailerDetails.header,
    };
    AuthenticatedGetRequest(data).then((res) => {
      if (res.status == 200) {
        store.dispatch({
          type: "RETAILER_DETAILS",
          payload: res.data,
        });
        registerForPushNotificationsAsync(res.data);
      } else {
        registerForPushNotificationsAsync();
      }
    });
  };

  const distributorDetails = () => {
    const data = {
      method: commonApi.getDistributorDetails.method,
      url: commonApi.getDistributorDetails.url,
      header: commonApi.getDistributorDetails.header,
    };
    AuthenticatedGetRequest(data).then((res) => {
      if (res.status == 200) {
        store.dispatch({
          type: "RETAILER_DETAILS",
          payload: res.data,
        });
        registerForPushNotificationsAsync(res.data);
      } else {
        registerForPushNotificationsAsync();
      }
    });
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
      dispatch(setExpoTokens(token));
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

      if(retailer_data?.user)
      Analytics.logEvent("token_fcm", {
        token,
        user_id: retailer_data?.user,
        androidId: Application.androidId,
        appVersion: Constants.manifest?.version,
        appVersionCode: Constants.manifest?.android?.versionCode,
        androidVersion: Constants.systemVersion,
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

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert("App Updated", "App has been updated. Will restart now.", [
          { text: "OK", onPress: () => Updates.reloadAsync() },
        ]);
      } else {
      }
    } catch (e) {}
  };

  const getStack = () => {
    if (retailerData?.id) {
      if (forceUpdateFromPlayStore) {
        return <VersionStack colorScheme={colorScheme} />;
      } else {
        return <Navigation colorScheme={colorScheme} />;
      }
    } else {
      return <AuthStack colorScheme={colorScheme} />;
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await getUserDetails();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
  //     await SplashScreen.hideAsync();
  //   }
  // }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return <SafeAreaView style={{ flex: 1 }}>{getStack()}</SafeAreaView>;
}

export default connect(mapStateToProps, {
  setTokens,
  setLandingScreen,
})(Routes);
