import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import commonStyles from "@commonStyles";
import texts from "@texts";

export const SolidButtonBlue = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={[commonStyles.solidButtonBlue, { paddingHorizontal: 8 }]}
    >
      <Text style={texts.whiteTextBold14}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export const BorderButtonSmallRed = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={commonStyles.borderButtonSmallRed}
    >
      <Text style={[texts.redTextBold12, { textAlign: "center" }]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export const BorderButtonSmallBlue = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={[commonStyles.borderButtonSmallBlue,props.style]}
    >
      <Text style={[texts.primaryTextBold12, { textAlign: "center" }]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export const BorderButtonSmallWhite = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={commonStyles.borderButtonSmallWhite}
    >
      <Text style={[texts.greyTextBold12, { textAlign: "center" }]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export const BorderButtonBigRed = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={commonStyles.borderButtonSmallRed}
    >
      <Text style={texts.primaryTextBold15}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export const GreyBorderButtonBig = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={commonStyles.greyBorderButton}
    >
      <Text style={texts.greyTextBold15}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export const BorderButtonBigBlue = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={commonStyles.borderButtonBigBlue}
    >
      <Text style={texts.blueBoldl14}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export const BlueButtonSmall = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={commonStyles.blueButtonSmall}
    >
      <Text style={texts.whiteTextBold12}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export const BlueButtonMedium = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={commonStyles.blueButtonMedium}
    >
      <Text style={[texts.whiteTextBold12, { textAlign: "center" }]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export const SolidButtonSmallRed = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.ctaFunction}
      style={commonStyles.solidButtonSmallRed}
    >
      <Text style={[texts.primaryTextBold12, { textAlign: "center" }]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};
