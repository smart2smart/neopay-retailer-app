import React, { useState } from "react";
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
import {
  BorderButtonBigRed,
  BorderButtonSmallRed,
  SolidButtonBlue,
  SolidButtonRed,
} from "@Buttons";
import InputBox from "../add-retailer/InputBox";
import { AttendanceMarkAPI } from "./services";

type DropDownModalProps = {
  visible: boolean;
  onClose: Function;
  title: string;
  VisitOptions: any[];
  modalType: "popup" | "bottomDrawer";
};

const DropDownModal = (props: DropDownModalProps) => {
  const [isLoading, setLoading] = useState(false);
  const { modalType = "popup" } = props;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => props.onClose()}
    >
      <View
        style={[
          {
            backgroundColor: "rgba(0,0,0,.5)",
            flex: 1,
          },
          modalType === "bottomDrawer"
            ? {
                justifyContent: "flex-end",
              }
            : {
                justifyContent: "center",
                alignItems: "center",
              },
        ]}
      >
        <View
          style={[
            {
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            },
            modalType === "bottomDrawer"
              ? {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  width: "100%",
                }
              : {
                  width: "80%",
                },
          ]}
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
            <Text style={[texts.blackTextBold16]}>{props.title}</Text>
            <TouchableOpacity onPress={props.onClose}>
              <Entypo name="cross" size={24} color={colors.grey} />
            </TouchableOpacity>
          </View>

          {props.VisitOptions.map((item) => (
            <TouchableOpacity
              style={[
                {
                  marginBottom: 0,
                },
                modalType === "bottomDrawer"
                  ? {
                      padding: 20,
                      borderBottomColor: "#ddd",
                      borderBottomWidth: 1,
                      paddingBottom: 10,
                    }
                  : {
                      margin: 20,
                    },
              ]}
              onPress={item.onclick}
            >
              <Text style={[texts.greyTextBold14]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
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

export default DropDownModal;
