import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    TextInput,
    ScrollView,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import commonStyles from "@commonStyles";
import colors from "@colors";
import texts from "@texts";

export default function QPSModal(props) {

    const [data, setData] = useState({});

    useEffect(() => {
        let productData = props.data;
        productData.data[0].qps.forEach((item, index) => {
            if (index < productData.data[0].qps.length - 1) {
                item["start_quantity"] = item.min_qty;
                item["end_quantity"] = productData.data[0].qps[index + 1].min_qty - 1;
            } else if (index == productData.data[0].qps.length - 1) {
                item["start_quantity"] = item.min_qty;
                item["end_quantity"] = " +";
            }
        })
        setData(productData);
    }, [props.data])


    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={props.closeModal}
        >
            <View style={{}}>
                <TouchableOpacity onPress={props.closeModal} style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalDiv}>
                            {data.product_group_id ? <View style={[commonStyles.rowAlignCenter, {paddingVertical: 10}]}>
                                <Image style={styles.productImage}
                                       source={data.image ? {uri: data.image} : require('../assets/images/placeholder_profile_pic.jpg')}/>
                                <View style={{marginLeft: 10}}>
                                    <Text style={[texts.greyNormal14, {paddingBottom: 5}]}>
                                        {data.company_name} {">"} {data.brand_name}
                                    </Text>
                                    <Text style={texts.redTextBold14}>
                                        {data.product_group}
                                    </Text>
                                </View>
                            </View> : null}
                            {!data.collapsed?<View>
                                {data.data ? data.data.map((entity, subIndex) => {
                                    return (
                                        <View key={entity.id + subIndex + '' + entity.name}>
                                            <View style={[commonStyles.rowSpaceBetween,{backgroundColor:'white', marginTop:10, borderRadius:5, paddingVertical:6, paddingHorizontal:4}]}>
                                                <View style={{width: '70%'}}>
                                                    <View>
                                                        <Text style={[texts.greyNormal12, {paddingTop: 5}]}>
                                                            {entity.name}
                                                        </Text>
                                                    </View>
                                                    <View style={[commonStyles.rowAlignCenter, {paddingVertical: 4}]}>
                                                        <Text style={texts.darkGreyTextBold14}>
                                                            {entity.product_group_id ? entity.variant : entity.name}
                                                        </Text>
                                                        {entity.product_group_id ? <Text style={texts.redTextBold14}>
                                                            {" > " + entity.sku}
                                                        </Text> : null}
                                                    </View>
                                                    <View style={commonStyles.rowSpaceBetween}>
                                                        <View style={commonStyles.row}>
                                                            <Text style={texts.greyTextBold12}>
                                                                MRP:
                                                            </Text>
                                                            <Text style={texts.greyTextBold12}>
                                                                {" " + entity.mrp}
                                                            </Text>
                                                        </View>
                                                        <View style={commonStyles.row}>
                                                            <Text style={texts.greyTextBold12}>
                                                                Rate:
                                                            </Text>
                                                            <Text style={texts.greyTextBold12}>
                                                                {" " + entity.rate}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View>
                                                    {entity.sku_image ? <Image style={{width: 50, height: 50}}
                                                                               resizeMode={"contain"}
                                                                               source={{uri: entity.sku_image}}/> : null}
                                                </View>
                                            </View>
                                            <View style={{marginTop: 10}}>
                                                {entity.qps.map((qps, index) => {
                                                    let str = qps["start_quantity"];
                                                    str += index == entity.qps.length - 1 ? "" : " - ";
                                                    str += qps["end_quantity"]
                                                    return (
                                                        <View key={index+""+qps.id} style={styles.qpsDiv}>
                                                            <View style={{flex: 1}}>
                                                                <Text style={texts.darkGreyTextBold12}>
                                                                    {str}
                                                                </Text>
                                                            </View>
                                                            <View style={{flex: 2}}>
                                                                <Text style={texts.darkGreyTextBold12}>
                                                                    Rate:
                                                                    Rs {parseFloat(parseFloat(entity.rate) * (1 - qps.discount_rate / 100)).toFixed(2)}/pc
                                                                </Text>
                                                            </View>
                                                            <View style={{flex: 1.5}}>
                                                                <Text style={texts.greenBold12}>
                                                                    Margin: {parseFloat(((entity.mrp - entity.rate * (1 - qps.discount_rate / 100)) / entity.rate) * 100).toFixed(2)}%
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                        </View>)
                                }) : null}
                            </View>:null}
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalDiv: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.5,
        backgroundColor: colors.light_grey,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 10
    },
    productImage: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 5
    },
    qpsDiv: {
        backgroundColor: colors.white,
        flexDirection: "row",
        paddingVertical: 6,
        paddingHorizontal: 5,
        borderRadius: 4,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "space-between"
    },
})