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
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import commonStyles from "@commonStyles";
import texts from "@texts";
import colors from "@colors";
import Indicator from "@utils/Indicator";
import SecondaryHeader from "@headers/SecondaryHeader";
import DropDownInput from "@commons/DropDownInput";
import { commonApi } from "@api";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";
import { AuthenticatedPostRequest } from "@authenticatedPostRequest";
import { BlueButtonMedium } from "@Buttons";
import { setRetailerDetails } from "@actions";

type PendingInfoPopupProps = {
  visible: boolean;
  onClose: Function;
  retailerDetails: any;
  onSubmit: Function;
};

const PendingInfoPopup = (props: PendingInfoPopupProps) => {
  const dispatch = useDispatch();
  const { retailerDetails } = props;
  const [isLoading, setLoading] = useState(false);
  const salesman = useSelector((state: any) => state.salesman);

  const [metData, setMetaData] = useState({ store_types: [] });
  const [selectedStoreType, setSelectedStoreType] = useState(
    retailerDetails.store_type
  );
  const [selectedShopFormat, setSelectedShopFormat] = useState(
    retailerDetails.format_type
  );
  const [selectedStoreArea, setSelectedStoreArea] = useState(
    retailerDetails.store_area
  );
  const [selectedTurnOver, setSelectedTurnOver] = useState(
    retailerDetails.turn_over
  );

  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const selectEntity = (data, type) => {
    const dataToSend = {
      method: commonApi.updateRetailerProfile.method,
      url: commonApi.updateRetailerProfile.url + retailerDetails.id + "/",
      header: commonApi.updateRetailerProfile.header,
      data: data,
    };
    AuthenticatedPostRequest(dataToSend).then((res) => {
      if (res.status === 200) {
        dispatch(setRetailerDetails(res.data.data));
      }
    });
  };

  const getMetaData = () => {
    const data = {
      method: commonApi.getRetailerMetaData.method,
      url: commonApi.getRetailerMetaData.url,
      header: commonApi.getRetailerMetaData.header,
    };
    // @ts-ignore
    AuthenticatedGetRequest(data).then((res) => {
      if (res.status == 200) {
        setMetaData(res.data);
      }
    });
  };

  useEffect(() => {
    getMetaData();
  }, []);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => props.onClose()}
    >
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
            <Text style={texts.blackTextBold18}>Complete your profile</Text>
          </View>

          {!retailerDetails.store_type ? (
            <DropDownInput
              modalType={"bottomDrawer"}
              label={"Type of store : "}
              options={metData.store_types || []}
              value={selectedStoreType.name || retailerDetails.store_type}
              setValue={(item) => {
                setSelectedStoreType({ key: item.key, name: item.value });
                selectEntity({ store_type: item.key }, "shopType");
              }}
            />
          ) : null}

          {!retailerDetails.format_type ? (
            <DropDownInput
              modalType={"bottomDrawer"}
              label={"Shop Format : "}
              options={metData.format_types || []}
              value={selectedShopFormat.name || retailerDetails.format_type}
              setValue={(item) => {
                setSelectedShopFormat({ key: item.key, name: item.value });
                selectEntity({ format_type: item.key }, "shopFormat");
              }}
            />
          ) : null}
          {!retailerDetails.store_area ? (
            <DropDownInput
              modalType={"bottomDrawer"}
              label={"Area of store : "}
              options={metData.area_choices || []}
              value={selectedStoreArea.name || retailerDetails.store_area}
              setValue={(item) => {
                setSelectedStoreArea({ key: item.key, name: item.value });
                selectEntity({ store_area: item.key }, "storeArea");
              }}
            />
          ) : null}
          {!retailerDetails.turn_over ? (
            <DropDownInput
              modalType={"bottomDrawer"}
              label={"Turnover : "}
              options={metData.turn_over_choices || []}
              value={selectedTurnOver.name || retailerDetails.turn_over}
              setValue={(item) => {
                setSelectedTurnOver({ key: item.key, name: item.value });
                selectEntity({ turn_over: item.key }, "turnOver");
              }}
            />
          ) : null}

          <View style={{ marginTop: 20 }}>
            <BlueButtonMedium
              text="Submit"
              style={{ height: 36 }}
              ctaFunction={() => {
                if (
                  selectedStoreType &&
                  selectedShopFormat &&
                  selectedStoreArea &&
                  selectedTurnOver
                ) {
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
                  Alert.alert("Alert", "Please all details for place order");
                }
              }}
            />
          </View>
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
});

export default PendingInfoPopup;
