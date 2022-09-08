import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import commonStyles from "@commonStyles";
import colors from "@colors";


const RatingInput = ({
  rating,
  setRating,
  style = {},
  starSize = 30,
  starColor = "#ffc200",
}) => {
  //   const range = new Array(5).fill(1);
  const range = [1, 2, 3, 4, 5];

  return (
    <View
      style={[
        commonStyles.rowSpaceBetween,
        {
          marginTop: 10,
          padding: 10,
          borderColor: "#888",
          borderWidth: 1,
          borderRadius: 5,
        },
        style,
      ]}
    >
      {range.map((item) => (
        <TouchableOpacity onPress={() => setRating(item)}>
          <MaterialIcons
            name="star"
            size={starSize}
            color={rating >= item ? starColor : colors.grey}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RatingInput;
