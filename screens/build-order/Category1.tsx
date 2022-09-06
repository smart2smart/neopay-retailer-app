import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "@colors";
import texts from "@texts";

type Category1Props = {
  categoryList: any[];
  selectedCategory: any;
  setSelectedCategory: Function;
};

const Category1 = ({
  categoryList,
  selectedCategory,
  setSelectedCategory,
}: Category1Props) => {
  return (
    <ScrollView style={[styles.tabsContainer]} horizontal={true}>
      {categoryList.map((item, category1Index) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              item.id == selectedCategory?.id
                ? { backgroundColor: colors.red }
                : { backgroundColor: "#ddd" },
              {
                marginRight: 10,
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
                maxWidth: 130,
                minWidth: 100,
                justifyContent: "center",
                alignItems: "center",
              },
              category1Index === 0
                ? {
                    marginLeft: 12,
                  }
                : {},
            ]}
            onPress={() => {
              if (selectedCategory?.id !== item.id) {
                setSelectedCategory(item);
              }
            }}
          >
            <Text
              style={[
                item.id == selectedCategory?.id
                  ? texts.whiteTextBold12
                  : texts.darkGreyTextBold12,
                {
                  textAlign: "center",
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Category1;
const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    paddingBottom: 10,
  },
});
