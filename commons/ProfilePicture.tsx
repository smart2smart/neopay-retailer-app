import { Text, View } from "react-native";

type ProfilePictureProps = {
  text?: string;
  textStyle?: object;
  style?: object;
};

const ProfilePicture = (props: ProfilePictureProps) => {
  return (
    <View
      style={[
        {
          width: 100,
          height: 100,
          backgroundColor: "#ddd",
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "#999",
        },
        props.style,
      ]}
    >
      <Text style={[{ fontSize: 16, color: "#666" }, props.textStyle]}>
        {props?.text?.length > 0 ? props.text[0] : "N"}
      </Text>
    </View>
  );
};

export default ProfilePicture;
