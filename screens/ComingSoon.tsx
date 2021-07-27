// import * as React from 'react';
import React, {Component, useEffect, useState} from 'react';
import {View, StyleSheet, Text,FlatList, Image} from "react-native";
import texts from "../styles/texts";
import PrimaryHeader from "../headers/PrimaryHeader";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from '../styles/commonStyles';
import { BorderButtonBigRed } from '../buttons/Buttons';
import colors from "../assets/colors/colors";

export default function ComingSoon(props:any) {

    const navigation = useNavigation();

    return(
        <View style={{flex: 1}}>
            <PrimaryHeader navigation={props.navigation}/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={texts.blackTextBold18}>
                    COMING SOON
                </Text>
            </View> 
        </View>
    )

//     const mockData = {
//         id: 534,
//         name: "Vikram stores",
//         distributors: [
//             {
//                 pk: 1475,
//                 name: "Subodh Trading",
//                 profile_picture: null
//             },
//             {
//                 pk: 1461,
//                 name: "Anannya1",
//                 profile_picture: null
//             },
//             {
//                 pk: 1480,
//                 name: "Gloify_Distributor",
//                 profile_picture: null
//             },
//         ],
//     };

//     const navigation = useNavigation();
//     const [distributorData, setDistributorData] = useState(mockData);

//     const createOrder = (distributorID) => {
//         navigation.navigate("CreateOrder", {distributorID})
//         // console.log("distrivutorID", distributorID);
//     };

//     const distributorDescription = (item) => {
//         return(
//             <View style={{marginVertical:20}}>
//                 <View style={[commonStyles.row, {paddingHorizontal:20}]}> 
//                     <View style={{width:'25%'}}>
//                         {/* <Image resizeMode={"contain"} style={styles.cardImage} source={{uri: item.profile_picture}}/> */}
//                         <Image resizeMode={"contain"} style={styles.cardImage} source={{uri: item.profile_picture}}/>
//                     </View>
//                     <View style={{width:'70%'}}>
//                         <BorderButtonBigRed text={item.name} ctaFunction={() => createOrder(item.pk)}/>
//                     </View>
//                 </View>
//             </View>
//         )
//     }


//     return (
//         <View style={{flex:1}}>
//             <PrimaryHeader navigation={props.navigation}/>
//             {/* <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
//                 <Text style={texts.blackTextBold18}>
//                     COMING SOON
//                 </Text>
//             </View> */}
//             <FlatList
//                 data={distributorData.distributors}
//                 showsVerticalScrollIndicator={false}
//                 keyExtractor={(item) => item.name + ""}
//                 renderItem={({item, index}) =>distributorDescription(item, index)}
//             />
//         </View>
//     );
}

const styles = StyleSheet.create({
    cardImage: {
        height: 40,
        width: 80,
        backgroundColor: colors.light_grey
    },
})
