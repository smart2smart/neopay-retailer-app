import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import texts from "@texts";
import InputBox from "./InputBox";
import colors from "@colors";
import commonStyles from "@commonStyles";
import { SolidButtonBlue } from "@Buttons";
import VerifyMobileNumber from "../cart/VerifyMobileNumber";

export default function AddStoreDetails(props) {
  const [shopName, setShopName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [ShowVerifyMobileNumber, setShowVerifyMobileNumber] = useState(false);

  const saveData = () => {
    let data = {
      name: shopName,
      contact_person_name: contactPersonName,
      email: email,
      contact_no: mobileNumber,
    };
    props.saveData(data);
  };

  useEffect(() => {
    if (props.data) {
      setContactPersonName(props.data.contact_person_name);
      setEmail(props.data.email);
      setShopName(props.data.name);
      setMobileNumber(props.data.contact_no);
    }
  }, []);

  return (
    <View style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={texts.darkGreyTextBold16}>Store Details</Text>
        <InputBox
          title={"Shop Name:"}
          placeholder={"Enter shop name"}
          value={shopName}
          setter={setShopName}
        />
        <InputBox
          title={"Contact Person:"}
          placeholder={"Enter contact person name"}
          value={contactPersonName}
          setter={setContactPersonName}
        />
        <InputBox
          title={"Email ID:"}
          placeholder={"Enter Email ID"}
          value={email}
          setter={setEmail}
        />

        <View>
          <Text style={[texts.redTextBold12, { paddingTop: 20 }]}>
            Mobile Number:
          </Text>
          <TouchableOpacity
            style={[style.textInput]}
            onPress={() => {
              setShowVerifyMobileNumber(true);
            }}
          >
            <Text style={texts.greyTextBold14}>
              {mobileNumber || "Enter Mobile Number"}
            </Text>
          </TouchableOpacity>
        </View>

        <VerifyMobileNumber
          visible={ShowVerifyMobileNumber}
          onClose={() => {
            setShowVerifyMobileNumber(false);
          }}
          onSubmit={(mobileNumber) => {
            setShowVerifyMobileNumber(false);
            setMobileNumber(mobileNumber)
          }}
          retailerDetails={props.data}
        />
      </ScrollView>
      <View style={[commonStyles.row, { marginTop: 12 }]}>
        <SolidButtonBlue ctaFunction={saveData} text={"Save"} />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    padding: 8,
  },
});
