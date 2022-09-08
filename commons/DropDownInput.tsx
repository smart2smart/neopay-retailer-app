import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import commonStyles from "@commonStyles";

import texts from "@texts";

import ModalPopup from "@screens/survey/ModalPopup";
import colors from "@colors";


type DropDownModalProps = {
  value: string;
  setValue: Function;
  label?: string;
  options: any[];
  modalType?: "popup" | "bottomDrawer";
};

const DropDownInput = ({ value, options, setValue, label, modalType }) => {
  const [showDropDownOption, setShowDropDownOption] = useState(false);

  return (
    <>
      {label ? (
        <Text style={[texts.redTextBold12, { paddingTop: 20 }]}>{label}</Text>
      ) : null}
      <TouchableOpacity
        style={[
          commonStyles.rowSpaceBetween,
          {
            marginTop: label ? 10 : 40,
            padding: 10,
            borderColor: "#888",
            borderWidth: 1,
            borderRadius: 5,
          },
        ]}
        onPress={() => setShowDropDownOption(true)}
      >
        <Text style={texts.darkGreyTextBold16}>
          {value || "Please Select option"}
        </Text>
        <View
          style={{
            backgroundColor: "#f6ebf0",
            width: 25,
            height: 25,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="keyboard-arrow-right"
            size={25}
            color={colors.red}
          />
        </View>
      </TouchableOpacity>
      <ModalPopup
        modalType={modalType}
        visible={showDropDownOption}
        title="Select Options"
        onClose={() => setShowDropDownOption(false)}
        VisitOptions={
          options
            ? options.map((item) => {
                return {
                  label: item.label || item.value,
                  onclick: () => {
                    setShowDropDownOption(false);
                    setValue(item);
                  },
                };
              })
            : []
        }
      />
    </>
  );
};

export default DropDownInput;
