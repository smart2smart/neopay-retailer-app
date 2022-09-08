import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import texts from "@texts";
import store from "../store/store";
import PersistenceStore from "@utils/PersistenceStore";
import BottomTabNavigator from "./BottomTabNavigator";
import colors from "@colors";
import mapStateToProps from "../store/mapStateToProps";
import { connect } from "react-redux";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "@screens/home/HomeScreen";
import SurveyList from "@screens/survey";

const DrawerNavigator = createDrawerNavigator();

function Drawer() {
  return (
    <DrawerNavigator.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <DrawerNavigator.Screen
        key={"Home"}
        name={"Home"}
        component={BottomTabNavigator}
      />
      <DrawerNavigator.Screen
        key={"SurveyList"}
        name={"SurveyList"}
        component={SurveyList}
      />
    </DrawerNavigator.Navigator>
  );
}

export default connect(mapStateToProps, {})(Drawer);

const LogOut = () => {
  Alert.alert(
    "LogOut",
    "Are you sure you want to logout?",
    [
      {
        text: "Yes",
        onPress: () => {
          store.dispatch({ type: "RESET_RETAILER" });
          PersistenceStore.removeTimeStamp();
          PersistenceStore.removeUserType();
          PersistenceStore.removeAccessToken();
          PersistenceStore.removeRefreshToken();
        },
      },
      { text: "No", onPress: () => {} },
    ],
    { cancelable: false }
  );
};

const RenderItem = (props) => (
  <TouchableOpacity
    style={styles.renderItem}
    onPress={props.onPress}
  >
    <Text style={texts.darkGreyTextBold14}>{props.title}</Text>
    <View>
      <Ionicons name="ios-arrow-forward" size={20} color={colors.darkGrey} />
    </View>
  </TouchableOpacity>
);

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const navigate = (screen: String) => {
    navigation.navigate(screen);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      showsVerticalScrollIndicator={false}
      style={styles.drawer}
      {...props}
    >
      <View style={styles.container}>
        <View>
          <View>
            <RenderItem
              title={"Home"}
              onPress={() => {
                navigate("Home");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Cart"}
              onPress={() => {
                navigate("Cart");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Orders"}
              onPress={() => {
                navigate("Orders");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Survey"}
              onPress={() => {
                navigate("SurveyList");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Profile"}
              onPress={() => {
                navigate("Account");
              }}
            />
          </View>
          <View>
            <RenderItem
              title={"Logout"}
              onPress={() => {
                LogOut();
              }}
            />
          </View>
        </View>
        <View style={styles.version}>
          <Text style={texts.greyTextBold14}>
            Version - {Constants.manifest.version}
          </Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    height: Dimensions.get("window").height,
  },
  container: {
    height: Dimensions.get("window").height,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  renderItem: {
    borderBottomColor: "#bfbfbf",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  version: {
    borderTopColor: "#bfbfbf",
    borderTopWidth: 1,
    marginHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
