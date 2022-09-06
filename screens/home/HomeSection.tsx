import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "@colors";
import ProfilePicture from "@commons/ProfilePicture";
import commonStyles from "@commonStyles";
import texts from "@texts";

const HomeSection = (props) => {
  const [showAll, setShowAll] = useState(false);
  return props.data.length > 0 ? (
    <View>
      <View style={[commonStyles.rowSpaceBetween, styles.companyHeader]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[texts.blueNormal15, { fontSize: 18 }]}>
            {"Browse " + props.title}
          </Text>
        </View>
        {props.data.length > 6 ? (
          <TouchableOpacity
            style={{ backgroundColor: colors.blue, padding: 5 }}
            onPress={() => setShowAll(!showAll)}
          >
            <Text style={texts.whiteTextBold14}>
              {showAll ? "Show Less" : "Show All"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={showAll ? props.data : props.data.slice(0, 6)}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        ItemSeparatorComponent={() => <View style={{ height: 4 }}></View>}
        keyExtractor={(item, index) => item.id + index + ""}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              props.onClick(item);
            }}
            style={{
              borderRadius: 10,
              marginLeft: "1%",
              width: "32%",
              height: 145,
              alignItems: "center",
            }}
          >
            {item.image ? (
              <Image
                resizeMode="contain"
                source={{ uri: item.image }}
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#777",
                  width: "85%",
                  height: 100,
                  marginBottom: 3,
                }}
              />
            ) : (
              <ProfilePicture text={item.name} />
            )}
            <Text style={[texts.blackTextBold14, { lineHeight: 18 }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  ) : null;
};

export default HomeSection;
const styles = StyleSheet.create({
  companyHeader: {
    paddingTop: 7,
    paddingBottom: 7,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#aaa",
    borderBottomColor: "#aaa",
  },
});
