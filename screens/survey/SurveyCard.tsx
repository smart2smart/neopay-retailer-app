import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";

import colors from "@colors";
import texts from "@texts";
import commonStyles from "@commonStyles";
import { BorderButtonSmallBlue, SolidButtonBlue } from "@Buttons";

const SurveyCard = (props: any) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.mainContainer]}>
      <View style={commonStyles.rowSpaceBetween}>
        <Text
          style={[
            texts.darkGreyTextBold16,
            { marginVertical: 4, width: "90%" },
          ]}
        >
          {props.title}
        </Text>
        <Text style={[texts.greyTextBold12]}>
          {moment(props.created_at).format("DD-MMM")}
        </Text>
      </View>
      <View>
        <Text
          style={[texts.greyTextBold14, { width: "90%" }]}
          numberOfLines={4}
        >
          {props.description}
        </Text>
      </View>
      <View style={{ marginTop: 20 }}>
        {props.responses.map((item) =>
          item.status === "completed" ? (
            <BorderButtonSmallBlue
              style={[
                commonStyles.rowSpaceBetween,
                { height: 36, paddingHorizontal: 20, marginTop: 5 },
              ]}
              textStyle={texts.redTextBold14}
              text={`Completed (${moment(item.created_at).format(
                "DD-MMM hh:mm"
              )})`}
              icon={
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[texts.redTextBold14, { marginRight: 10 }]}>
                    View
                  </Text>
                  <AntDesign name="arrowright" size={24} color={colors.red} />
                </View>
              }
              ctaFunction={() => {
                navigation.navigate("view-survey", item);
              }}
            />
          ) : (
            <SolidButtonBlue
              style={[
                commonStyles.rowSpaceBetween,
                { paddingHorizontal: 20, marginTop: 5 },
              ]}
              text="Complete Now"
              icon={
                <View>
                  <AntDesign name="arrowright" size={24} color={colors.white} />
                </View>
              }
              ctaFunction={() => navigation.navigate("survey", item)}
            />
          )
        )}
        {!(new Date(props.end_date) < new Date()) &&
        (props.responses.length == 0 ||
          props.responses.every((item) => item.status === "completed")) ? (
          <SolidButtonBlue
            style={[
              commonStyles.rowSpaceBetween,
              { paddingHorizontal: 20, marginTop: 5 },
            ]}
            text="Take a another Survey"
            icon={
              <View>
                <AntDesign name="arrowright" size={24} color={colors.white} />
              </View>
            }
            ctaFunction={() =>
              navigation.navigate("survey", {
                survey: props.id,
                ...props,
                id: null,
              })
            }
          />
        ) : (
          <BorderButtonSmallBlue
            style={[
              commonStyles.rowSpaceBetween,
              {
                height: 36,
                paddingHorizontal: 20,
                marginTop: 5,
                borderColor: colors.grey,
                backgroundColor: "#eee",
              },
            ]}
            textStyle={[texts.greyTextBold14]}
            text={`You missed this survey`}
            ctaFunction={() => {}}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 5,
    shadowColor: colors.grey,
    elevation: 4,
    backgroundColor: "#fff",
    padding: 15,
  },
});

export default SurveyCard;
