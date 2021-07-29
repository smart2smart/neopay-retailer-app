import React, { Component, useEffect, useState } from 'react';
import {Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, TextInput, Alert, FlatList} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import mapStateToProps from "../../store/mapStateToProps";
import { setIsLoggedIn } from "../../actions/actions";
// @ts-ignore
import { connect, useSelector } from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import texts from '../../styles/texts';
import commonStyles from '../../styles/commonStyles';
import { BorderButtonSmallBlue, SolidButtonBlue, BorderButtonSmallRed } from '../../buttons/Buttons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/AntDesign';
import {commonApi} from "../../api/api";
import {AuthenticatedPostRequest} from "../../api/authenticatedPostRequest";

export default function ReviewCart(props) { 

    // console.log('DATA', props.route.params.data);
    const navigation = useNavigation();
    const [reviewOrder, setReviewOrder] = useState(props.route.params.data);
    // console.log('DATA', reviewOrder);

    const selectProduct = (index: number, item, type: string) => {
        let data = item;
        const productDataMap = {...reviewOrder};
        let quantity = productDataMap.orderedData[index].value;
    
        if (type === "add") {
          quantity = quantity == "" ? 1 : parseInt(quantity) + 1;
        } else {
          if (quantity > 0) {
            quantity = parseInt(quantity) - 1;
          }
        }
        productDataMap.orderedData[index].value = quantity;
        setReviewOrder(productDataMap);
        // console.log('%%%%%%',productDataMap);
    }

    const setProductQuantity = (item, text) => {
        let data = item;
        data.value = text;
        setReviewOrder(data);
    }

    const discardOrder = () => {
        navigation.navigate("Cart")
    }

    const productDescription = (item, index) => {
        return(
            <ScrollView showsHorizontalScrollIndicator={false}>
                <View style={[commonStyles.row, {marginVertical:15}]}>
                    <View>
                        <Image style={styles.cardImage} source={require("../../assets/images/adaptive-icon.png")}/>
                    </View>
                    <View style={{marginLeft:16}}>
                        <Text style={texts.greyNormal10}>{item.company_code} </Text>
                        <Text style={texts.blackTextBold14}>{item.variant}</Text>
                    </View>
                </View>
                <View style={commonStyles.rowSpaceBetween}>
                    <Text style={texts.greyTextBold12}>{item.sku}</Text>
                    {item.value === 0 ?
                    <BorderButtonSmallRed ctaFunction={() => {
                        selectProduct(index, item, "add");
                    }} text={"Add"}/> : <View style={styles.quantityButton}>
                        <TouchableOpacity onPress={() => {
                            selectProduct(index, item, "subtract")
                        }} style={styles.addSubtractButton}>
                            <Text style={texts.whiteTextBold16}>
                                -
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            value={item.value.toString()}
                            maxLength={10}
                            keyboardType={"numeric"}
                            onChangeText={(text) => setProductQuantity(item, text)}
                            style={styles.cartInput}>
                        </TextInput>
                        <TouchableOpacity onPress={() => {
                            selectProduct(index,item, "add")
                        }} style={styles.addSubtractButton}>
                            <Text style={texts.whiteTextBold16}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>}
                </View>
                <View style={[commonStyles.row, {borderBottomWidth:1, borderBottomColor:colors.lightGrey, paddingBottom:20}]}>
                    <View style={{marginRight:20}}>
                        <Text style={texts.greyNormal10}>MRP: {item.mrp}</Text>
                    </View>
                    <Text style={texts.greyNormal10}>Rate: {item.rate}</Text>
                </View>
            </ScrollView>
        )
    }

    return (
        <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: colors.white }}>
            <SecondaryHeader title={"Cart"} />
            <View style={{marginVertical:20}}>
                <Text style={texts.blackTextBold14}>
                    SKUs in Cart
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={reviewOrder.orderedData}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.name + ""}
                    renderItem={({item, index}) =>productDescription(item, index)}
                />
            </View>
            <View style={[commonStyles.rowSpaceBetween, {borderTopColor:colors.light_grey, borderTopWidth:1, paddingVertical:20}]}>
                <View>
                    <Text>Total Items: {reviewOrder.item}</Text>
                </View>
                <View>
                    <Text>Order Value: {reviewOrder.price}</Text>
                </View>
            </View>
            <View style={[commonStyles.rowFlexEnd, {borderTopColor:colors.light_grey, borderTopWidth:1, paddingVertical:20}]}>
                <View>
                    <BorderButtonSmallBlue ctaFunction={discardOrder} text={'Discard'} />
                </View>
                <View style={{marginLeft:10}}>
                    <SolidButtonBlue text={' Confirm Order '}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardImage: {
        height: 42,
        width: 42,
    },
    quantityButton: {
        flexDirection: 'row',
        height: 24
    },
    cartInput: {
        width: 35,
        height: 24,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 3,
        textAlign: 'center',
        fontFamily: 'GothamMedium',
        color: colors.darkGrey,
        fontSize: 12
    },
    addSubtractButton: {
        width: 24,
        height: 24,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
    },

})