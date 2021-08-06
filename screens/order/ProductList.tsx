import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image, Alert,
} from 'react-native';
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import texts from '../../styles/texts';
import commonStyles from '../../styles/commonStyles';
import {BorderButtonSmallRed} from '../../buttons/Buttons';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import {useNavigation, useRoute} from "@react-navigation/native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddProductButton from "./AddProductButton";
import {connect, useSelector} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {addToCart, updateCartAdd, updateCartSubtract, cartChangeQuantity, clearCart} from "../../actions/actions";
import CartButton from "../../commons/CartButton";
import store from "../../store/store";
import PersistenceStore from "../../utils/PersistenceStore";


const sku_units = {
    1: 'kg',
    2: 'g',
    3: 'ml',
    4: 'ltr',
    5: 'pcs',
    6: 'strip',
    7: 'pack',
    8: 'tablet',
    9: 'box',
    10: 'bag'
}


function ProductList(props) {

    let _ = require('underscore')
    const route = useRoute();
    const cart = useSelector((state: any) => state.cart);
    const [searchText, setSearchText] = useState("");
    const [productData, setProductData] = useState([]);
    const [originalProductData, setOriginalProductData] = useState([]);

    useEffect(() => {
        getproductData();
    }, []);

    const getproductData = () => {
        const data = {
            method: commonApi.getDistributorProducts.method,
            url: commonApi.getDistributorProducts.url + "?distributor_id=" + route.params.distributorId,
            header: commonApi.getDistributorProducts.header,
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            let groupedData = _.chain(res.data)
                .groupBy("product_group")
                .map((value, key) => ({
                    company_name: value[0]["company_name"],
                    brand_name: value[0]["brand_name"],
                    image: value[0]["product_group_image"],
                    product_group: key,
                    image_expanded: false,
                    product_group_id: value[0]["product_group_id"],
                    data: value
                })).value()
            matchQuantityWithCart(groupedData);
        });
    }


    const matchQuantityWithCart = (groupedData)=>{
        let data = {}
        cart.data.forEach((item)=>{
            item.data.forEach((itm)=>{
                data[itm.id] = itm.quantity
            })
        })
        groupedData.forEach((item)=>{
            item.data.forEach((itm)=>{
                if(data[itm.id]){
                    itm["quantity"] = data[itm.id]
                }
            })
        })
        setProductData(groupedData);
        setOriginalProductData(groupedData);
    }

    const searchProduct = (text)=>{
        setSearchText(text);
        if(text===""){
            setProductData(originalProductData);
        }else{
            let filteredData = originalProductData.map((item)=>{
                return {...item, data: item.data.filter((itm)=>{
                    return itm.name.toLowerCase().includes(text.toLowerCase())
                })}
            })
            let removeBoolean = filteredData.filter((item)=>{
                return item.data.length>0
            })
            console.log(removeBoolean)
            setProductData(removeBoolean);
        }
    }


    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let item = {distributorId: route.params.distributorId, product: {...data}, text:text};
        let allProducts = [...productData];
        allProducts[mainIndex]["data"][subIndex]["quantity"] = text;
        setProductData(allProducts);
        props.cartChangeQuantity(item)
    }

    const selectProductAlert = (data, type, mainIndex, subIndex) => {
        if(cart.distributorId && cart.distributorId !== route.params.distributorId){
            Alert.alert(
                'Change Distributor',
                `You have items in your cart from another distributor. Adding new distributor will clear your cart. Are you sure you want to continue?`,
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            props.clearCart();
                            PersistenceStore.removeCart();
                            selectProduct(data, type, mainIndex, subIndex);

                        },
                    },
                    {text: 'No', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
        }else{
            selectProduct(data, type, mainIndex, subIndex);
        }

    }

    const selectProduct = (data, type, mainIndex, subIndex)=>{
        let item = {distributorId: route.params.distributorId, product: {...data}};
        let allProducts = [...productData];
        if (type === "new") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = 1;
            props.addToCart(item);
        } else if (type == "add") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = parseInt(allProducts[mainIndex]["data"][subIndex]["quantity"])+1;
            props.updateCartAdd(item);
        } else if (type == "subtract") {
            if (allProducts[mainIndex]["data"][subIndex]["quantity"] > 0) {
                allProducts[mainIndex]["data"][subIndex]["quantity"] = parseInt(allProducts[mainIndex]["data"][subIndex]["quantity"])-1 ;
            }
            props.updateCartSubtract(item);
        }
        setProductData(allProducts);
    }

    const expandImage = (mainIndex, subIndex)=>{
        let allProducts = [...productData];
        allProducts[mainIndex]["data"][subIndex]["image_expanded"] = !allProducts[mainIndex]["data"][subIndex]["image_expanded"];
        setProductData(allProducts);
    }

    const renderItem = ({item, index}) => {
        return (
            <View>
                <View style={styles.underline}>
                    {item.product_group_id?<Text style={texts.darkGreyTextBold14}>
                        {item.company_name}
                    </Text>:<Text style={texts.darkGreyTextBold14}>Others</Text>}
                </View>
                {item.product_group_id?<View style={[commonStyles.rowAlignCenter, {paddingTop: 10}]}>
                    <View>
                        <Image style={styles.productImage}
                               source={item.image ? {uri: item.image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                    </View>
                    <View style={{paddingLeft: 10}}>
                        <Text style={[texts.greyNormal14, {paddingBottom: 8}]}>
                            {item.company_name} {">"} {item.brand_name}
                        </Text>
                        <Text style={texts.redTextBold14}>
                            {item.product_group}
                        </Text>
                    </View>
                </View>:null}
                {item.data.map((item, subIndex) => {
                    return (<View key={item.id+subIndex+''+item.name} style={styles.underline}>
                        {item.image_expanded?<TouchableOpacity onPress={()=>{expandImage(index, subIndex)}}>
                            <Image style={{width: '100%', height:200, borderRadius:5}}
                                   source={item.sku_image ? {uri: item.sku_image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                        </TouchableOpacity>:null}
                        <View style={commonStyles.rowSpaceBetween}>
                            <View style={{width: '70%'}}>
                                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 5}]}>
                                    <Text style={texts.darkGreyTextBold14}>
                                        {item.name}
                                    </Text>
                                    {item.product_group_id?<Text style={texts.redTextBold14}>
                                        {" " + item.sku_quantity}{sku_units[item.sku_unit]}
                                    </Text>:null}
                                </View>
                                <View style={commonStyles.rowSpaceBetween}>
                                    <View style={commonStyles.row}>
                                        <Text style={texts.greyTextBold12}>
                                            MRP:
                                        </Text>
                                        <Text style={texts.greyTextBold12}>
                                            {" " + item.mrp}
                                        </Text>
                                    </View>
                                    <View style={commonStyles.row}>
                                        <Text style={texts.greyTextBold12}>
                                            Rate:
                                        </Text>
                                        <Text style={texts.greyTextBold12}>
                                            {" " + item.rate}
                                        </Text>
                                    </View>
                                    <View style={commonStyles.rowAlignCenter}>
                                        <Text style={texts.greyTextBold12}>
                                            Margin:
                                        </Text>
                                        <Text style={texts.greenBold12}>
                                            {" " + (((item.mrp - item.rate) / item.rate) * 100).toFixed(1)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width: '30%', flexDirection:"column", alignItems:"flex-end"}}>
                                {!item.image_expanded?<TouchableOpacity onPress={()=>{expandImage(index, subIndex)}}>
                                    <Image style={{width:50, height:50}}
                                          resizeMode={"contain"} source={item.sku_image ? {uri: item.sku_image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                                </TouchableOpacity>:null}
                                <View>
                                    <AddProductButton
                                        item={item}
                                        mainIndex={index}
                                        subIndex={subIndex}
                                        setProductQuantity={setProductQuantity}
                                        selectProduct={selectProductAlert}
                                    />
                                </View>

                            </View>
                        </View>
                    </View>)
                })}
            </View>
        )
    }


    return (
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <View style={commonStyles.rowSpaceBetween}>
                <SecondaryHeader title={"Create Order"}/>
            </View>
            <View style={[commonStyles.searchContainer, {marginTop: 24, marginBottom: 12}]}>
                <TextInput
                    value={searchText}
                    onChangeText={(text) => searchProduct(text)}
                    placeholder={"Search for Products"}
                    style={commonStyles.textInput}
                />
                {searchText !== '' ? <TouchableOpacity onPress={() => searchProduct('')}
                                                       style={{position: "absolute", right: 0, padding: 10}}>
                    <AntDesign name="close" size={18} color={colors.black}/>
                </TouchableOpacity> : null}
            </View>
            <FlatList
                data={productData}
                ItemSeparatorComponent={() => <View style={{height: 20}}></View>}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item.product_group_id + "" + item.product_group_name}
                renderItem={renderItem}
                ListFooterComponent={() => <View style={{paddingBottom: 50}}></View>}
            />
            {cart.data.length > 0 ? <CartButton/> : null}
        </View>
    )
}

export default connect(
    mapStateToProps,
    {addToCart, updateCartAdd, updateCartSubtract, cartChangeQuantity, clearCart}
)(ProductList);


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
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.blue,
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        paddingBottom: 10
    },
    productImage: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 5
    }
})