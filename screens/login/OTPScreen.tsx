import React, { Component } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import colors from "@colors";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { authApi, commonApi } from "@api";
import { PostRequest } from "@postRequest";
import mapStateToProps from "../../store/mapStateToProps";
import {
  setLandingScreen,
  setTokens,
  setVerificationStatus,
  setUserType,
  setExpoTokens
} from "@actions";
// @ts-ignore
import { connect } from "react-redux";
import PersistenceStore from "@utils/PersistenceStore";
import Indicator from "@utils/Indicator";
import { BorderButtonSmallRed, SolidButtonBlue } from "@Buttons";
import texts from "@texts";
import SecondaryHeader from "@headers/SecondaryHeader";
import moment from "moment";
import { checkTokenFromStorage } from "@checkToken";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";
import store from "../../store/store";
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
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";

class OTPScreen extends Component {
  state = {
    isLoading: false,
    version: Constants.manifest.version,
  };

  openSettings = () => {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
    );
  };

  selectCurrentLocation = async () => {
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
              this.openSettings();
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

  verifyOTP = (code: string) => {
    if (!/^\d{6}$/.test(code)) {
      Alert.alert("Please enter a valid OTP");
      return;
    }
    this.setState({ isLoading: true });
    const data = {
      method: authApi.otp.method,
      url: authApi.otp.url,
      data: {
        contact_no: this.props.route.params.mobile,
        otp: code,
        version: this.state.version,
      },
      header: authApi.refresh.header,
    };

    PostRequest(data).then((res) => {
      if (res.status == 200) {
        this.props.setUserType("3");
        this.props.setTokens({
          access: res["data"]["access"],
          refresh: res["data"]["refresh"],
          timestamp: moment().valueOf().toString(),
        });

        PersistenceStore.setUserType("3");
        PersistenceStore.setTimeStamp(moment().valueOf().toString());
        PersistenceStore.setAccessToken(res["data"]["access"]);
        PersistenceStore.setRefreshToken(res["data"]["refresh"]);
        PersistenceStore.setLandingScreen(res.data.screen);
        PersistenceStore.setVerificationStatus(
          res.data.verification_status.toString()
        );
        this.retailerDetails();
        this.props.setLandingScreen(res.data.screen);
        this.props.setVerificationStatus(res.data.verification_status);
      } else {
        Alert.alert(res.data.error);
      }
    });
    this.setState({ isLoading: false });
  };

  registerForPushNotificationsAsync = async (retailer_data) => {
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
      this.props.setExpoTokens(token)
      const location = await this.selectCurrentLocation();
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

      if (retailer_data?.user)
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
    } catch (err) {
      console.log(err);
    }
  };

  retailerDetails = () => {
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
        this.registerForPushNotificationsAsync(res.data);
      }
    });
  };

  requestOTP = () => {
    if (!/^\d{10}$/.test(this.props.route.params.mobile)) {
      Alert.alert("Please enter a valid mobile number");
    } else {
      this.setState({ isLoading: true });
      const data = {
        method: authApi.mobileLogin.method,
        url: authApi.mobileLogin.url,
        data: {
          contact_no: this.props.route.params.mobile,
        },
        header: authApi.refresh.header,
      };
      PostRequest(data).then((res) => {
        if (res && res.status == 200) {
          // @ts-ignore
          Alert.alert("OTP has been sent to the your contact number");
        } else {
          Alert.alert(res.data.error);
        }
        this.setState({ isLoading: false });
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <SecondaryHeader title={"Enter Otp"} />
        <Indicator isLoading={this.state.isLoading} />
        <Text style={[texts.blueHeading1, { marginTop: 80 }]}>
          Enter Verification code
        </Text>
        <Text style={[texts.greyNormal14, { marginTop: 18 }]}>
          Enter 6-digit Verification Code send to your mobile
        </Text>
        <View style={styles.mobileInputContainer}>
          <OTPInputView
            codeInputFieldStyle={texts.darkGrey18Bold}
            codeInputHighlightStyle={styles.borderStyleHighLighted}
            autoFocusOnLoad={true}
            pinCount={6}
            onCodeFilled={(code) => {
              this.verifyOTP(code);
            }}
          />
        </View>
        <View style={styles.footer}>
          <Text style={[texts.greyNormal14, { marginRight: 10 }]}>
            Didn't received code ?
          </Text>
          <BorderButtonSmallRed ctaFunction={this.requestOTP} text={"RESEND"} />
        </View>
        <View style={{ marginTop: 60 }}>
          <SolidButtonBlue text={"CONTINUE"} ctaFunction={this.verifyOTP} />
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, {
  setTokens,
  setLandingScreen,
  setVerificationStatus,
  setUserType,
  setExpoTokens,
})(OTPScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 72,
    height: 56,
  },
  mobileInputContainer: {
    height: 48,
    marginTop: 48,
  },
  footer: {
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  countryCodeDiv: {
    marginVertical: 12,
    width: "26%",
    borderRightWidth: 1,
    borderRightColor: colors.lightGrey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileInputDiv: {
    width: "74%",
  },
  downArrow: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 0,
    borderColor: "transparent",
    width: "100%",
    height: 48,
    paddingLeft: 10,
  },
  borderStyleHighLighted: {
    borderColor: colors.primary_color,
  },
});
