import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import texts from "@texts";
import React from "react";
import colors from "@colors";

type InputBoxProps = {
  style?: any;
  title?: String;
  value: string;
  placeholder?: string;
  setter: Function;
  textBoxStyle?: any;
  maxLength?: Number;
  multiline?: boolean;
  numPad?: "numeric" | "default";
};

export default function InputBox(props: InputBoxProps) {
  return (
    <View style={props.style}>
      {props.title ? (
        <Text style={[texts.redTextBold12, { paddingTop: 20 }]}>
          {props.title}
        </Text>
      ) : null}
      <TextInput
        value={props.value}
        placeholder={props.placeholder || ""}
        onChangeText={(text) => props.setter(text)}
        style={[styles.textInput, texts.greyTextBold14, props.textBoxStyle]}
        multiline={props.multiline || false}
        numberOfLines={props.multiline ? 5 : 1}
        maxLength={props.maxLength ? props.maxLength : 150}
        keyboardType={props.numPad ? "numeric" : "default"}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    paddingLeft: 10,
    height: 45,
  },
});
