import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import moment from "moment";

import commonStyles from "@commonStyles";
import texts from "@texts";
import colors from "@colors";
import Indicator from "@utils/Indicator";
import SecondaryHeader from "@headers/SecondaryHeader";
import { commonApi } from "@api";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";
import { AuthenticatedPostRequest } from "@authenticatedPostRequest";
import { BorderButtonSmallBlue, SolidButtonBlue } from "@Buttons";

import InputBox from "../survey/InputBox";
import OTPInputView from "@twotalltotems/react-native-otp-input";

type VerifyMobileNumberProps = {
  visible: boolean;
  onClose: Function;
  retailerDetails: any;
  onSubmit: Function;
};

const VerifyMobileNumber = (props: VerifyMobileNumberProps) => {
  const { retailerDetails } = props;
  const [isLoading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(retailerDetails.contact_no);
  const salesman = useSelector((state: any) => state.salesman);
  const [viewOption, setViewOption] = useState("requestOTP");

  const selectEntity = (data) => {
    const dataToSend = {
      method: commonApi.updateRetailer.method,
      url: commonApi.updateRetailer.url + retailerDetails.id + "/",
      header: commonApi.updateRetailer.header,
      data: data,
    };
    AuthenticatedPostRequest(dataToSend).then((res) => {
      if (res.status === 200) {
      }
    });
  };

  const requestOTP = () => {
    setLoading(true);
    const data = {
      method: commonApi.retailerOtp.method,
      url: commonApi.retailerOtp.url,
      data: {
        contact_no: mobileNumber,
      },
      header: commonApi.retailerOtp.header,
    };
    AuthenticatedPostRequest(data).then((res) => {
      if (res && res.status == 200) {
        Alert.alert(
          "Success!",
          "OTP has been sent to the your contact number",
          [
            {
              onPress: () => setViewOption("verifyOTP"),
              text: "Ok",
            },
          ]
        );
      }
      setLoading(false);
    });
  };

  const verifyOTP = (code: string) => {
    if (!/^\d{6}$/.test(code)) {
      Alert.alert("Alert", "Please enter a valid OTP");
      return;
    }
    setLoading(true);
    const data = {
      method: commonApi.registerRetailerVerifyOtp.method,
      url: commonApi.registerRetailerVerifyOtp.url,
      data: {
        contact_no: mobileNumber,
        otp: code,
      },
      header: commonApi.registerRetailerVerifyOtp.header,
    };
    AuthenticatedPostRequest(data).then((res) => {
      setLoading(false);
      if (res) {
        if (res.status == 200) {
          Alert.alert(
            "Success!",
            "The Profile is now complete and is ready to place orders.",
            [
              {
                text: "Place Order",
                onPress: () => props.onSubmit(),
              },
            ]
          );
        } else {
          res?.data?.error && Alert.alert(res.data.error);
        }
      }
    });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => props.onClose()}
    >
      <Indicator isLoading={isLoading} />
      <View
        style={{
          backgroundColor: "rgba(0,0,0,.5)",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "90%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text style={[texts.greyTextBold16]}>{"Final Step!"}</Text>
            <TouchableOpacity onPress={props.onClose}>
              <Entypo name="cross" size={24} color={colors.grey} />
            </TouchableOpacity>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={texts.blackTextBold18}>Verify Mobile Number</Text>
          </View>
          {viewOption !== "verifyOTP" ? (
            <>
              <Text style={[texts.greyTextBold14, { lineHeight: 16 }]}>
                This retailer has an unverified mobile number. Verify their
                mobile number to place orders.
              </Text>

              <InputBox
                setter={setMobileNumber}
                value={mobileNumber}
                title="Mobile Number"
                maxLength={10}
                placeholder={"+91"}
                numPad={"numeric"}
              />

              <View style={{ marginTop: 20 }}>
                <SolidButtonBlue text="Request OTP" ctaFunction={requestOTP} />
              </View>
            </>
          ) : (
            <>
              <Text style={[texts.greyTextBold14, { lineHeight: 16 }]}>
                {` OTP has been sent to the number +91${mobileNumber}`}
              </Text>
              <View style={style.mobileInputContainer}>
                <OTPInputView
                  codeInputFieldStyle={texts.darkGrey18Bold}
                  codeInputHighlightStyle={{ borderColor: colors.red }}
                  autoFocusOnLoad={false}
                  pinCount={6}
                  onCodeFilled={(code) => {
                    verifyOTP(code);
                  }}
                />
              </View>
              <View style={style.footer}>
                <Text style={[texts.greyNormal14, { marginRight: 10 }]}>
                  Didn't received code ?
                </Text>
                <BorderButtonSmallBlue
                  ctaFunction={requestOTP}
                  text={"RESEND"}
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <SolidButtonBlue
                  text="Submit"
                  ctaFunction={() => verifyOTP()}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  textDiv: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  mobileInputContainer: {
    height: 48,
    marginTop: 20,
  },
  ctaDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light_grey,
  },
  iconDiv: {
    marginLeft: 10,
    backgroundColor: colors.orangeFaded,
    borderRadius: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: "auto",
  },
  imageContainer: {
    position: "relative",
    height: 200,
    width: "100%",
    backgroundColor: "#d6d6d6",
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonDiv: {
    backgroundColor: colors.orangeFaded,
    borderWidth: 1,
    borderColor: colors.red,
    padding: 7,
    borderRadius: 2,
    position: "absolute",
    right: 20,
    top: 20,
  },
  footer: {
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default VerifyMobileNumber;
