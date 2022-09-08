import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import colors from "@colors";
  import texts from "@texts";
  
  type tabButtonProps = {
    tabList: any[];
    selectedTab: string;
    setSelectedTab: Function;
    tabStyle: "default" | "rounded";
  };
  
  const TabButtons = ({
    tabList,
    selectedTab,
    setSelectedTab,
    tabStyle = "default",
  }: tabButtonProps) => {
    return (
      <View style={styles.container}>
        {tabList.map((item) => (
          <TouchableOpacity
            onPress={() => setSelectedTab(item.value)}
            style={[
              tabStyle === "default"
                ? selectedTab === item.value
                  ? styles.selectedTab
                  : styles.unSelectedTab
                : selectedTab === item.value
                ? {
                    backgroundColor: colors.red,
                    borderRadius: 20,
                    borderBottomWidth: 0,
                    marginHorizontal: 5,
                    flexGrow: 1,
                    alignItems: "center",
                    padding: 8,
                  }
                : {
                    backgroundColor: "#ddd",
                    borderRadius: 20,
                    borderBottomWidth: 0,
                    marginHorizontal: 5,
                    flexGrow: 1,
                    alignItems: "center",
                    padding: 8,
                  },
            ]}
          >
            <Text
              style={[
                tabStyle === "default"
                  ? selectedTab === item.value
                    ? texts.redTextBold16
                    : texts.greyTextBold16
                  : selectedTab === item.value
                  ? texts.whiteNormal14
                  : texts.darkGreyTextBold14,
                {
                  marginHorizontal: 5,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  export default TabButtons;
  
  const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
      marginTop: 10,
      flexDirection: "row",
      width: "100%",
    },
    unSelectedTab: {
      flexGrow: 1,
      alignItems: "center",
      borderBottomColor: colors.light_grey,
      borderBottomWidth: 2,
      padding: 8,
    },
    selectedTab: {
      flexGrow: 1,
      alignItems: "center",
      borderBottomColor: colors.red,
      borderBottomWidth: 2,
      padding: 8,
    },
  });
  