import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TextInput, Alert, TouchableOpacity } from "react-native";
import colors from "../../assets/colors/colors";
import { setIsLoggedIn, setTokens,setUserEmail } from "../../actions/actions";
// @ts-ignore
import { connect } from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import { PostRequest } from "../../api/postRequest";
import { authApi } from "../../api/api";
import Indicator from "../../utils/Indicator";
import {
  BorderButtonBigBlue,
  BorderButtonSmallRed,
  SolidButtonBlue,
} from "../../buttons/Buttons";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import * as Updates from "expo-updates";
import Entypo from 'react-native-vector-icons/Entypo';
import { AuthenticatedPostRequest } from "../../api/authenticatedPostRequest";
import PersistenceStore from "../../utils/PersistenceStore";

class LoginScreen extends Component {
  state = {
    mobileNumber: "",
    isLoading: false,
    loginMethod: "mobile",
    email: "",
    password: "",
    passwordVisible: false,
  };

  onchangeMobile = (text: string) => {
    this.setState({ mobileNumber: text });
  };

  onChangeEmail = (text: string) => {
    this.setState({ email: text });
  };

  onChangePassword = (text: string) => {
    this.setState({ password: text });
  };

  setLoginType = () => {
    let { loginMethod } = this.state;
    this.setState({
      loginMethod: loginMethod === "mobile" ? "email" : "mobile",
    });
  };

  loginWithEmail = () => {
    this.setState({ isLoading: true });
    const data = {
      method: authApi.emailLogin.method,
      url: authApi.emailLogin.url,
      data: {
        email: this.state.email,
        password: this.state.password,
      },
      header: authApi.refresh.header,
    };
    PostRequest(data).then((res) => {
    this.setState({ isLoading: false });
      if (res && res.status == 200) {
        // @ts-ignore
        this.props.setUserEmail(this.state.email);
        this.props.setTokens({
          access: res["data"]["access"],
          refresh: res["data"]["refresh"],
          timestamp: new Date().toString(),
        });
        PersistenceStore.setUserEmail(this.state.email);
        PersistenceStore.setTimeStamp(new Date().toString());
        PersistenceStore.setAccessToken(res["data"]["access"]);
        PersistenceStore.setRefreshToken(res["data"]["refresh"]);
        // @ts-ignore
        this.props.setIsLoggedIn(true);
      } else {
        Alert.alert(res.data.detail);
      }
      this.setState({ isLoading: false });
    });
  };

  togglePassword = () => {
    this.setState((prevState, props) => ({
      passwordVisible: !prevState.passwordVisible,
    }));
  };

  checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert("App Updated", "App has been updated. Will restart now.", [
          { text: "OK", onPress: () => Updates.reloadAsync() },
        ]);
      }
    } catch (e) {}
  };

  componentDidMount() {
    this.checkForUpdates();
  }

  requestOTP = () => {
    if (!/^\d{10}$/.test(this.state.mobileNumber)) {
      Alert.alert("Please enter a valid mobile number");
    } else {
      this.setState({ isLoading: true });
      const data = {
        method: authApi.mobileLogin.method,
        url: authApi.mobileLogin.url,
        data: {
          contact_no: this.state.mobileNumber,
        },
        header: authApi.refresh.header,
      };
      PostRequest(data).then((res) => {
        if (res && res.status == 200) {
          // @ts-ignore
          this.props.navigation.navigate("Otp", {
            mobile: this.state.mobileNumber,
          });
        } else {
          // Alert.alert(res.data.error);
        }
        this.setState({ isLoading: false });
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Indicator isLoading={this.state.isLoading} />
        <View>
          <Image
            style={styles.logo}
            resizeMode={"contain"}
            source={require("../../assets/images/vitran_logo.png")}
          />
          <Text style={[texts.blueHeading1, { marginTop: 50 }]}>
            Enter{" "}
            {this.state.loginMethod === "mobile" ? "Mobile Number" : "Email"}
          </Text>
          <Text style={[texts.greyNormal14, { marginTop: 18 }]}>
            Enter your{" "}
            {this.state.loginMethod === "mobile"
              ? "mobile number"
              : "email and password"}{" "}
            for account verification
          </Text>

          {this.state.loginMethod === "mobile" ? (
            <View style={[styles.mobileInputContainer, { marginBottom: 30 }]}>
              <View style={[styles.countryCodeDiv, commonStyles.rowCenter]}>
                <Text style={texts.greyNormal14}>+91</Text>
                <Image
                  style={styles.downArrow}
                  source={require("../../assets/images/down_arrow.png")}
                />
              </View>
              <View style={styles.mobileInputDiv}>
                <TextInput
                  value={this.state.mobileNumber}
                  maxLength={10}
                  keyboardType={"numeric"}
                  onChangeText={(mobile) => this.onchangeMobile(mobile)}
                  style={commonStyles.textInput}
                ></TextInput>
              </View>
            </View>
          ) : (
            <View style={{ paddingTop: 30, paddingBottom: 30 }}>
              <View style={styles.textInputDiv}>
                {this.state.email ? (
                  <Text style={texts.primaryTextBold14}>Email</Text>
                ) : null}
                <TextInput
                  value={this.state.email}
                  placeholder={"Email"}
                  onChangeText={(text) => this.onChangeEmail(text)}
                  style={styles.textInput}
                ></TextInput>
              </View>
              <View style={styles.textInputDiv}>
                {this.state.password ? (
                  <Text style={texts.primaryTextBold14}>Password</Text>
                ) : null}
                <TextInput
                  value={this.state.password}
                  placeholder={"Password"}
                  secureTextEntry={!this.state.passwordVisible}
                  keyboardType={"default"}
                  onChangeText={(text) => this.onChangePassword(text)}
                  style={styles.textInput}
                ></TextInput>
                {this.state.password !== "" ? (
                  <TouchableOpacity
                    onPress={this.togglePassword}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 20,
                      padding: 10,
                    }}
                  >
                    {this.state.passwordVisible ? (
                      <Entypo
                        name="eye-with-line"
                        size={22}
                        color={colors.grey}
                      />
                    ) : (
                      <Entypo name="eye" size={22} color={colors.grey} />
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          )}
          <View style={[commonStyles.rowAlignCenter]}>
            <SolidButtonBlue
              text={
                this.state.loginMethod === "mobile" ? "REQUEST OTP" : "Continue"
              }
              ctaFunction={
                this.state.loginMethod === "mobile"
                  ? this.requestOTP
                  : this.loginWithEmail
              }
            />
          </View>
        </View>
        <View style={[commonStyles.rowCenter, { marginVertical: 30 }]}>
          <View
            style={{
              borderBottomColor: colors.light_grey,
              borderBottomWidth: 1,
              flex: 1,
            }}
          ></View>
          <Text style={[texts.greyNormal14, { marginHorizontal: 20 }]}>Or</Text>
          <View
            style={{
              borderBottomColor: colors.light_grey,
              borderBottomWidth: 1,
              flex: 1,
            }}
          ></View>
        </View>

        <View style={[commonStyles.rowAlignCenter]}>
          <BorderButtonBigBlue
            ctaFunction={this.setLoginType}
            text={
              this.state.loginMethod === "mobile"
                ? "Continue with email"
                : "Continue with mobile"
            }
          />
        </View>

        <View style={[commonStyles.rowCenter, { marginTop: 30 }]}>
          <Text style={[texts.greyNormal14, { marginRight: 10 }]}>
            Need help?
          </Text>
          <BorderButtonSmallRed text={"HELP"} />
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, { setIsLoggedIn, setTokens ,setUserEmail})(
  LoginScreen
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 120,
    height: 120,
  },
  mobileInputContainer: {
    height: 48,
    marginTop: 30,
    borderRadius: 5,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    flexDirection: "row",
  },
  countryCodeDiv: {
    marginVertical: 12,
    width: "26%",
    borderRightWidth: 1,
    borderRightColor: colors.lightGrey,
  },
  mobileInputDiv: {
    width: "74%",
  },
  downArrow: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  textInputDiv: {
    paddingBottom: 30,
    position: "relative",
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    fontFamily: "GothamMedium",
    borderWidth: 0,
    borderColor: "transparent",
    width: "100%",
    height: 40,
    padding: 0,
  },
});
