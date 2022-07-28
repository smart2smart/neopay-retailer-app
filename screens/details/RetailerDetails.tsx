import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import SecondaryHeader from "../../headers/SecondaryHeader";
import mapStateToProps from "../../store/mapStateToProps";
import {
  setLandingScreen,
  setTokens,
} from "../../actions/actions";
// @ts-ignore
import { connect, useSelector } from "react-redux";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import { BorderButtonSmallBlue, SolidButtonBlue } from "../../buttons/Buttons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { commonApi } from "../../api/api";
import { AuthenticatedPostRequest } from "../../api/authenticatedPostRequest";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PersistenceStore from "../../utils/PersistenceStore";

function RetailerDetails(props) {
  const route = useRoute();
  const retailerData = useSelector((state: any) => state.retailerDetails);
  const navigation = useNavigation();
  const [emailId, setEmailId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (retailerData) {
      setStoreName(retailerData.name);
      setContactPersonName(retailerData.contact_person_name);
      setEmailId(retailerData.email);
      if (retailerData.attachment) {
        setImage(retailerData.attachment);
      }
    }
  }, [retailerData]);

  const addressDetails = () => {
    if (!storeName) {
      alertMsg("Please enter store name.");
      return;
    }
    if (!contactPersonName) {
      alertMsg("Please enter contact person name.");
      return;
    }

    const data = {
      name: storeName,
      contact_person_name: contactPersonName,
      email: emailId,
    };
    let dataToSend = {};

    dataToSend = {
      method: commonApi.updateRetailerProfile.method,
      url: commonApi.updateRetailerProfile.url + retailerData.id + "/",
      header: commonApi.updateRetailerProfile.header,
      data: data,
    };

    // @ts-ignore
    AuthenticatedPostRequest(dataToSend).then((res) => {
      if (res.status == 200) {
        Alert.alert("Details updated successfully.");
        props.setLandingScreen("address");
        PersistenceStore.setLandingScreen("address");
        navigation.navigate("AddressDetails");
      } else {
        Alert.alert(res.data.error);
      }
    });
  };

  const alertMsg = (text: string) => {
    Alert.alert(text);
  };

  const data = [
    {
      type: "text",
      editable: true,
      placeholder: "Store Name*",
      onChange: setStoreName,
      value: storeName,
    },
    {
      type: "text",
      editable: true,
      placeholder: "Contact Person*",
      onChange: setContactPersonName,
      value: contactPersonName,
    },
    {
      type: "text",
      editable: true,
      placeholder: "Email Id",
      onChange: setEmailId,
      value: emailId,
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      if (route.params) {
        if (route.params.image) {
          setImage(route.params.image);
        }
      }
    }, [route.params])
  );

  const goToUploadImage = () => {
    navigation.navigate("UploadImage", {
      retailerId: retailerData.id,
      image: image,
      comingFrom: "retailer-details",
    });
  };

  return (
    <View
      style={{ flex: 1, paddingHorizontal: 24, backgroundColor: colors.white }}
    >
      <SecondaryHeader title={"Store Details"} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={[commonStyles.imageContainer, { marginBottom: 20 }]}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}
            <TouchableOpacity
              onPress={goToUploadImage}
              style={styles.editButtonDiv}
            >
              <MaterialIcons name="edit" size={24} color={colors.red} />
            </TouchableOpacity>
          </View>
          {data.map((item, index) => {
            if (item.type === "text") {
              return (
                <View style={styles.textInputDiv}>
                  <TextInput
                    key={index}
                    value={item.value}
                    editable={item.editable}
                    placeholder={item.placeholder}
                    onChangeText={item.onChange}
                    style={styles.textInput}
                  />
                </View>
              );
            } else {
              return (
                <View style={styles.textInputDiv}>
                  <View style={styles.textInputDiv}>
                    <Text>Contact and Email</Text>
                  </View>
                  <View style={styles.textInput}>
                    <View style={commonStyles.row}>
                      <View
                        style={[styles.countryCodeDiv, commonStyles.rowCenter]}
                      >
                        <Text style={texts.greyNormal14}>+91</Text>
                        <Image
                          style={styles.downArrow}
                          source={require("../../assets/images/down_arrow.png")}
                        />
                      </View>
                      <View>
                        <TextInput
                          key={index}
                          editable={item.editable}
                          maxLength={10}
                          keyboardType={"numeric"}
                          placeholder={"799 115 4771"}
                          onChangeText={item.onChange}
                          style={{ paddingLeft: 20 }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              );
            }
          })}
        </View>
        <View style={commonStyles.rowFlexEnd}>
          <SolidButtonBlue text={"NEXT"} ctaFunction={() => addressDetails()} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
  },

  signature: {
    height: 200,
    width: Dimensions.get("window").width - 48,
    marginTop: 20,
  },
  camera: {
    position: "absolute",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.orangeFaded,
    borderRadius: 5,
    bottom: 10,
    right: 10,
  },
  textInputDiv: {
    paddingBottom: 30,
  },
  textInput: {
    borderColor: "#e6e6e6",
    fontFamily: "GothamMedium",
    borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 5,
    padding: 10,
  },
  countryCodeDiv: {
    // marginVertical:12,
    width: "26%",
    borderRightWidth: 1,
    borderRightColor: colors.lightGrey,
  },
  downArrow: {
    width: 24,
    height: 24,
    marginLeft: 8,
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
});

export default connect(mapStateToProps, { setLandingScreen })(RetailerDetails);
