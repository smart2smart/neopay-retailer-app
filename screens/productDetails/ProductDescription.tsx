import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    FlatList,
    ScrollView,
    Image,
} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import mapStateToProps from "../../store/mapStateToProps";
import {setIsLoggedIn} from "../../actions/actions";
// @ts-ignore
import {connect, useSelector} from 'react-redux';
import PrimaryHeader from "../../headers/PrimaryHeader";
import colors from "../../assets/colors/colors";
import texts from '../../styles/texts';
import commonStyles from '../../styles/commonStyles';
import { BorderButtonSmallBlue, SolidButtonBlue, BorderButtonSmallRed, GreyBorderButtonBig } from '../../buttons/Buttons';
import {commonApi} from "../../api/api";
import { AuthenticatedGetRequest } from "../../api/authenticatedGetRequest";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import ProductVarient from "../productDetails/ProductVarient";
import ProductSku from "../productDetails/ProductSku";

export default function ProductDescription(props) {

    const navigation = useNavigation();
    const [productDetails, setProductDetails] = useState(props.route.params.data);
    const [modalVisible, setModalVisible] = useState(false);
    console.log('DATAAAAAAAAAA', productDetails);

    const varientModal = () => {
        setModalVisible(true);
    }

    const setSelectQuantity = (variant) => {
        console.log("###########", variant);
        const {product_group} = variant;
        return product_group ? `${product_group}` : "";
    }

    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <SecondaryHeader title={"Product Details"}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{marginTop:20}}>
                    <Image style={styles.cardImage} source={require("../../assets/images/adaptive-icon.png")}/>
                    {/* <Image style={styles.cardImage} source={{uri: productDetails.image}}/> */}
                </View>
                <View style={[commonStyles.rowSpaceBetween ,{marginTop:5}]}>
                    <View>
                        <Text style={texts.blackTextBold14}>{productDetails.variant}</Text>
                    </View>
                    <View>
                        <Text style={texts.greenNormal13}>INSTOCK</Text>
                    </View>
                </View>
                <View style={{marginTop:12}}>
                    <View style={commonStyles.row}>
                        <Text style={texts.darkGreyNormal12}>Distributor : </Text>
                        <Text style={texts.darkGreyNormal12}>{productDetails.distributor}</Text>
                    </View>
                    <View style={[commonStyles.row, {marginTop:12}]}>
                        <Text style={texts.darkGreyNormal12}>Product Code : </Text>
                        <Text style={texts.darkGreyNormal12}>{productDetails.code}</Text>
                    </View>
                </View>
                <View style={{marginVertical:24, alignSelf:'center'}}>
                    <Image style={styles.productImage} source={require("../../assets/images/adaptive-icon.png")}/>
                    {/* <Image style={styles.cardImage} source={{uri: productDetails.image}}/> */}
                </View>
                <View style={{marginBottom:12}}>
                    <Text style={texts.blackTextBold14}>Choose Varient</Text>
                </View>
                {/* <TouchableOpacity style={[commonStyles.rowSpaceBetween, {borderWidth:1, borderColor:colors.grey, borderRadius:5,padding:10}]}>
                    <View style={{marginLeft:12}}>
                        <Text style={texts.greyNormal14}>Peach</Text>
                    </View>
                    <Image style={styles.modalImage} source={require("../../assets/images/Group_1080.png")}/>
                </TouchableOpacity> */}
                <View>
                    <GreyBorderButtonBig
                        // text={setSelectQuantity(
                        //     productDetails && 
                        //     productDetails.find((el) => el.product_group)
                        // )} 
                        ctaFunction={() => varientModal()}
                    />
                    <ProductVarient
                        modalVisible={modalVisible}
                        data={productDetails}
                        closeModal={() => {
                            setModalVisible(false);
                        }}
                    />
                </View>
                <View style={[commonStyles.rowSpaceBetween, {marginTop:25}]}>
                    <View>
                        <Text style={texts.blackTextBold14}>Select SKU (Weight)</Text>
                        {/* <TouchableOpacity style={[commonStyles.rowSpaceBetween, {borderWidth:1, borderColor:colors.grey, borderRadius:5, padding:10, marginTop:10}]}>
                            <View style={{marginLeft:12}}>
                                <Text style={texts.greyNormal14}>200 ml</Text>
                            </View>
                            <Image style={styles.modalImage} source={require("../../assets/images/Group_1080.png")}/>
                        </TouchableOpacity> */}
                        <View style={{marginTop:10}}>
                            <GreyBorderButtonBig
                                // text={setSelectQuantity(
                                //     productDetails && 
                                //     productDetails.find((el) => el.product_group)
                                // )} 
                                ctaFunction={() => varientModal()}
                            />
                            <ProductSku
                                modalVisible={modalVisible}
                                data={productDetails}
                                closeModal={() => {
                                    setModalVisible(false);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{width:'45%'}}>
                        <Text style={texts.blackTextBold14}>Select Quantity</Text>
                        <TouchableOpacity style={[commonStyles.rowSpaceBetween, {borderWidth:1, borderColor:colors.grey, borderRadius:5, padding:10, marginTop:10}]}>
                            <View style={{marginLeft:12}}>
                                <Text style={texts.greyNormal14}>10 items</Text>
                            </View>
                            <Image style={styles.modalImage} source={require("../../assets/images/Group_1080.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginVertical:25}}>
                    <Text style={texts.blueBold12}>{productDetails.variant} {'|'} {productDetails.sku}</Text>
                </View>
                <View style={commonStyles.rowSpaceBetween}>
                    <Text style={texts.blackTextBold14}>MRP</Text>
                    <Text style={texts.greyTextBold16}>Rs {productDetails.mrp}</Text>
                </View>
                <View style={[commonStyles.rowSpaceBetween, {marginTop:15}]}>
                    <Text style={texts.blackTextBold14}>Purchase Price</Text>
                    <Text style={texts.lightRedNormal16}>Rs {productDetails.rate}</Text>
                </View>
                <View style={[commonStyles.rowSpaceBetween, {marginTop:15}]}>
                    <Text style={texts.blackTextBold14}>Percentage Margin</Text>
                    <Text style={texts.greenTextBold16}>20%</Text>
                </View>
                <View style={{marginVertical:20}}>
                    <SolidButtonBlue text={'ADD TO CART'}/>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    cardImage: {
        height: 42,
        width: 74,
    },
    productImage: {
        height: 250,
        width: 250,
    },
    modalImage: {
        height: 24,
        width: 24,
    }
})