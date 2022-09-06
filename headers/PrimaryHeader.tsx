import * as React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import colors from "@colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import commonStyles from "@commonStyles";
import texts from "@texts";

export default function PrimaryHeader(props: any) {
  const navigation = useNavigation();
  return (
    <View style={[styles.header, commonStyles.rowSpaceBetween]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Entypo name="menu" size={33} color="white" />
        </TouchableOpacity>
        <View style={{ marginLeft: 15 }}>
          <Image
            resizeMode={"contain"}
            style={styles.logo}
            source={require("../assets/images/neomart-white.png")}
          />
        </View>
      </View>
      {props.type == "verification" ? (
        <TouchableOpacity onPress={props.logout}>
          <Text style={texts.whiteTextBold16}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("notifications");
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={26}
            color={colors.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    backgroundColor: colors.primaryThemeColor,
    height: 56,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 30,
    width: 110,
  },
});
