import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList
} from "react-native";
import commonStyles from "@commonStyles";
import texts from "@texts";
import colors from "@colors";
import Icon from "react-native-vector-icons/AntDesign";

export default function ProductVarient(props) {
  const [quantityData, setQuantityData] = useState(props.data);
  const onQuantitySelect = (item) => {
      
  }
  
  const renderProductVarient = ({item}) => {
      return(
        <TouchableOpacity style={{borderColor: 'grey', borderWidth: 1, padding:5, marginBottom: 10}} onPress={() => onQuantitySelect(item)}>
            {/* <Text style={[texts.greyNormal14]}>Varient: {item.variant}</Text> */}
        </TouchableOpacity> 
      )
    }

  return (
    <Modal
      animationType="none"
      visible={props.modalVisible}
      onRequestClose={() => {
        props.closeModal();
      }}
    >
      <View style={commonStyles.modalContainer}>
        <View style={commonStyles.modalCloseIconDiv}>
          <TouchableOpacity
            onPress={() => {
              props.closeModal();
            }}
            style={[
              commonStyles.modalCloseIcon,
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text style={[texts.darkGreyTextBold16]}>Tap to select:</Text>
            <Icon name="close" size={24} color={colors.black} />
          </TouchableOpacity>
        </View>
        <View style={commonStyles.modalTextInputContainer}></View>
        {/* <FlatList
            data={quantityData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id + ""}
            renderItem={renderProductVarient}
        /> */}
      </View>
    </Modal>
  );
}