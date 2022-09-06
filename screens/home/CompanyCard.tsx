import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import React from "react";
import colors from "@colors";
import texts from "@texts";
import ProfilePicture from "@commons/ProfilePicture";

const RenderCompanyCard = ({ item, index }, props) => {
  let padding = ((Dimensions.get("window").width - 24) * 0.04) / 2;
  return (
    <View
      style={[
        styles.companyCard,
        (index + 1) % 3 !== 0 ? { marginRight: padding } : {},
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          props.selectFunction(item.type, item, props.modalVisible);
        }}
        style={[
          {
            width: "100%",
            height: "100%",
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.light_grey,
          },
        ]}
      >
        {item.image ? (
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
            source={{ uri: item.image }}
          />
        ) : (
          <ProfilePicture
            style={{
              borderRadius: 10,
              width: "100%",
              height: "100%",
              borderWidth: 0,
            }}
            text={item.name}
          />
        )}
      </TouchableOpacity>
      <Text style={[texts.darkGreyTextBold12, { marginBottom: 10 }]}>
        {item.name ? item.name.slice(0, 14) : ""}
      </Text>
    </View>
  );
};

export default RenderCompanyCard;

const styles = StyleSheet.create({
  companyCard: {
    height: 120,
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});
