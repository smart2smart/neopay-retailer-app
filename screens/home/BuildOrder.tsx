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
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddProductButton from "./AddProductButton";
import {connect, useSelector} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {updateCartAdd, updateCartSubtract, removeFromCart, clearCart, cartChangeQuantity} from "../../actions/actions";
import CartButton from "../../commons/CartButton";
import PersistenceStore from "../../utils/PersistenceStore";
import Indicator from "../../utils/Indicator";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import FilterBox from "../../commons/FilterBox";
import Icon from 'react-native-vector-icons/AntDesign'
import ProductFilter from './ProductFilter';


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


function BuildOrder(props) {
    let _ = require('underscore')
    const route = useRoute();
    const cart = useSelector((state: any) => state.cart);
    const [searchText, setSearchText] = useState("");
    const [productsData, setProductsData] = useState([]);
    const [originalProductsData, setOriginalProductsData] = useState([]);
    const [loading, setIsLoading] = useState(false);
    const distributor = useSelector((state: any) => state.distributor);
    const retailerData = useSelector((state: any) => state.retailerDetails);
    const [productFilterModal,setProductFilterModal] = useState(false);

    const getProductsData = () => {
        const dataToSend = {
            method: commonApi.getProducts.method,
            url: commonApi.getProducts.url + '?retailer_id=' + retailerData.id + "&distributor_id=" + distributor.user,
            header: commonApi.getProducts.header
        }
        setIsLoading(true)
        // @ts-ignore
        AuthenticatedGetRequest(dataToSend).then((res) => {
            let groupedData = _.chain(res.data)
                .sortBy(function (item) {
                    return item.company_name;
                })
                .groupBy("product_group")
                .map((value, key) => ({
                    company_name: value[0]["company_name"],
                    brand_name: value[0]["brand_name"],
                    image: value[0]["product_group_image"],
                    product_group: key,
                    image_expanded: false,
                    product_group_id: value[0]["product_group_id"],
                    data: value,
                    pg_image_expanded: false,
                    quantity: 0
                })).value()
            setIsLoading(false);
            setProductsData(groupedData);
            setOriginalProductsData(groupedData);
            if (cart.data.length > 0) {
                matchQuantityWithCart(groupedData);
            }
        })
    }

    const handleCollapse = (index) => {      
        let data = [...productsData];
        data[index].collapsed = !data[index].collapsed;
        setProductsData(data);        
    }

    useEffect(() => {
        if (route.params) {
            if (route.params.productData) {
                setProductsData(route.params.productData);
                setOriginalProductsData(route.params.productData);
                matchQuantityWithCart(route.params.productData)
                matchQuantityWithCart(route.params.productData)
            }
        } else {
            getProductsData();
        }
    }, []);

    useEffect(()=>{
        productsData.forEach((item,index) => {
            item["collapsed"] = true
        })
    },[productsData])

    const openProductsFilter = ()=>{
        console.log("clicked on filters");
        setProductFilterModal(true);
    }
    
    const matchQuantityWithCart = (items) => {
        let groupedData = [...items];
        let data = {}
        cart.data.forEach((item) => {
            data[item.id] = item.quantity
        })
        groupedData.forEach((item) => {
            item.data.forEach((itm) => {
                if (data[itm.id]) {
                    itm["quantity"] = data[itm.id]
                } else {
                    itm["quantity"] = 0;
                }
            })
        })
        setProductsData(groupedData);
        setOriginalProductsData(groupedData);
    }

    const searchProduct = (text) => {
        setSearchText(text);
        if (text === "") {
            setProductsData(originalProductsData);
        } else {
            let filteredData = originalProductsData.map((item) => {
                return {
                    ...item, data: item.data.filter((itm) => {
                        return itm.name.toLowerCase().includes() ||
                            (itm.brand_name && itm.brand_name.toLowerCase().includes(text.toLowerCase())) ||
                            (itm.company_name && itm.company_name.toLowerCase().includes(text.toLowerCase())) ||
                            (itm.product_group && itm.product_group.toLowerCase().includes(text.toLowerCase())) ||
                            (itm.variant && itm.variant.toLowerCase().includes(text.toLowerCase()))
                    })
                }
            })
            let removeBoolean = filteredData.filter((item) => {
                return item.data.length > 0
            })
            setProductsData([...removeBoolean]);
        }
    }

    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let item = {
            distributorId: distributor.user,
            product: {...data},
            text: text,
            originalQuantity: data.quantity == "" ? 0 : parseInt(data.quantity)
        };
        let allProducts = [...productsData];
        item.product["quantity"] = text;
        allProducts[mainIndex]["data"][subIndex]["quantity"] = text;
        setProductsData(allProducts);
        props.cartChangeQuantity(item);
    }

    const selectProductAlert = (data, type, mainIndex, subIndex) => {
        if (cart.distributorId && cart.distributorId !== distributor.user) {
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
                    {
                        text: 'No', onPress: () => {
                        }
                    },
                ],
                {cancelable: false},
            );
        } else {
            selectProduct(data, type, mainIndex, subIndex);
        }

    }

    const selectProduct = (data, type, mainIndex, subIndex) => {
        let item = {distributorId: distributor.user, product: {...data}};
        let allProducts = [...productsData];
        if (type === "new") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = 1;
            item.product.quantity = 1;
            props.updateCartAdd(item);
        } else if (type == "add") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = data.quantity ? parseInt(allProducts[mainIndex]["data"][subIndex]["quantity"]) + 1 : 1;
            item.product.quantity += 1;
            props.updateCartAdd(item);
        } else if (type == "subtract") {
            if (allProducts[mainIndex]["data"][subIndex]["quantity"] > 1) {
                allProducts[mainIndex]["data"][subIndex]["quantity"] = parseInt(allProducts[mainIndex]["data"][subIndex]["quantity"]) - 1;
                item.product.quantity -= 1;
                props.updateCartSubtract(item);
            } else {
                item.product.quantity = 0;
                allProducts[mainIndex]["data"][subIndex]["quantity"] = 0;
                props.removeFromCart(item);
            }
        }
        setProductsData(allProducts);
    }

    const expandImage = (mainIndex, subIndex) => {
        let allProducts = [...productsData];
        allProducts[mainIndex]["data"][subIndex]["image_expanded"] = !allProducts[mainIndex]["data"][subIndex]["image_expanded"];
        setProductsData(allProducts);
    }

    const expandProductGroupImage = (mainIndex) => {
        let allProducts = [...productsData];
        allProducts[mainIndex]["pg_image_expanded"] = !allProducts[mainIndex]["pg_image_expanded"];
        setProductsData(allProducts);
    }

    const renderItem = ({item, index}) => {
        return (
            <View>
                <View style={styles.underline}>
                    {item.product_group_id ? <Text style={texts.darkGreyTextBold14}>
                        {item.company_name}
                    </Text> : 
                        <View style={styles.rowSpaceBetween}>
                            <Text style={texts.darkGreyTextBold14}>Others</Text>
                            <View>
                            <TouchableOpacity style={styles.collapsableButton}
                                                onPress={() => {
                                                    handleCollapse(index)
                                                }}>
                                <Icon name={item.collapsed ? "down" : "up"} size={18} color={colors.red}/>
                            </TouchableOpacity>
                            </View>
                        </View>}
                </View>
                <View style={styles.rowSpaceBetween}>
                    <View>
                        {item.product_group_id ? <TouchableOpacity onPress={() => {
                        expandProductGroupImage(index)
                        }} style={[commonStyles.rowAlignCenter, {paddingVertical: 10}]}>
                        {!item.pg_image_expanded ? <View style={{marginRight: 10}}>
                            <Image style={styles.productImage}
                                source={item.image ? {uri: item.image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                        </View> : null}
                        <View>
                            <Text style={[texts.greyNormal14, {paddingBottom: 5}]}>
                                {item.company_name} {">"} {item.brand_name}
                            </Text>
                            <Text style={texts.redTextBold14}>
                                {item.product_group}
                            </Text>
                        </View>
                        </TouchableOpacity> : null}
                        {item.pg_image_expanded ? <TouchableOpacity onPress={() => {
                        expandProductGroupImage(index)
                        }}>
                        <Image style={{width: '100%', height: 200, borderRadius: 5}}
                            source={item.image ? {uri: item.image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                        </TouchableOpacity> : null}
                    </View>
                    {item.product_group_id?<View>
                        <TouchableOpacity style={styles.collapsableButton}
                                          onPress={() => {
                                              handleCollapse(index)
                                          }}>
                            <Icon name={item.collapsed ? "down" : "up"} size={18} color={colors.red}/>
                        </TouchableOpacity>
                    </View>:null}
                </View>
                {!item.collapsed ?
                <View>
                {item.data.map((item, subIndex) => {
                    let margin = ((item.mrp - item.rate) / item.rate) * 100
                    return (<View key={item.id + subIndex + '' + item.name} style={styles.underline}>
                        {item.image_expanded ? <TouchableOpacity onPress={() => {
                            expandImage(index, subIndex)
                        }}>
                            <Image style={{width: '100%', height: 200, borderRadius: 5}}
                                   source={item.sku_image ? {uri: item.sku_image} : require('../../assets/images/placeholder_profile_pic.jpg')}/>
                        </TouchableOpacity> : null}
                        <View style={commonStyles.rowSpaceBetween}>
                            <View style={{width: '70%'}}>
                                <View>
                                    <Text style={[texts.greyNormal12, {paddingTop: 5}]}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={[commonStyles.rowAlignCenter, {paddingVertical: 4}]}>
                                    <Text style={texts.darkGreyTextBold14}>
                                        {item.product_group_id ? item.variant : item.name}
                                    </Text>
                                    {item.product_group_id ? <Text style={texts.redTextBold14}>
                                        {" > " + item.sku}
                                    </Text> : null}
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
                                    <View>
                                        {margin > 0 ? <View style={commonStyles.rowAlignCenter}>
                                            <Text style={texts.greyTextBold12}>
                                                Margin:
                                            </Text>
                                            <Text style={texts.greenBold12}>
                                                {" " + margin.toFixed(1) + '%'}
                                            </Text>
                                        </View> : null}
                                    </View>
                                </View>
                            </View>
                            <View style={{width: '30%', flexDirection: "column", alignItems: "flex-end"}}>
                                {!item.image_expanded ? <TouchableOpacity onPress={() => {
                                    expandImage(index, subIndex)
                                }}>
                                    {item.sku_image ? <Image style={{width: 50, height: 50}}
                                                             resizeMode={"contain"}
                                                             source={{uri: item.sku_image}}/> : null}
                                </TouchableOpacity> : null}
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
                </View>:null}
            </View>
        )
    }


    return (
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <View style={commonStyles.rowSpaceBetween}>
                <SecondaryHeader title={"Create Order"}/>
            </View>
            <View style={[commonStyles.searchContainer, {marginTop: 12, marginBottom: 12}]}>
                <TextInput
                    value={searchText}
                    onChangeText={(text) => searchProduct(text)}
                    placeholder={"Search for Products"}
                    style={styles.textInput}
                />
                {searchText !== '' ? <TouchableOpacity onPress={() => searchProduct('')}
                                                       style={{position: "absolute", right: 0, padding: 10}}>
                    <AntDesign name="close" size={18} color={colors.black}/>
                </TouchableOpacity> : null}
            </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',padding:5}}>
                    <Text style={[texts.blueBoldl14, {paddingTop: 10}]}>
                        {productsData.length} item(s) found
                    </Text> 
                    <TouchableOpacity style={styles.filterBox} onPress={openProductsFilter}>
                        <Icon name="filter" size={16} color={colors.red}/>
                        <Text style={[texts.redTextBold14, {
                            paddingTop: 1,
                            paddingLeft: 5,
                            paddingRight: 5
                        }]}>FILTER </Text>
                    </TouchableOpacity>
                </View>
            <FlatList
                data={productsData}
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
    {updateCartAdd, updateCartSubtract, removeFromCart, clearCart, cartChangeQuantity}
)(BuildOrder);


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
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.greyFaded,
        width: '100%',
        height: 36,
        paddingLeft: 10,
        borderRadius: 5
    },
    collapsableButton: {
        borderWidth: 1.5,
        borderRadius: 4,
        padding:1,
        borderColor:colors.grey,
        backgroundColor: colors.white,
        marginRight:6,
        width:25
    },
    filterBox: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth:1,
        borderColor : colors.red,
        backgroundColor: colors.white,
        padding: 8
    },
    rowSpaceBetween :{
        justifyContent:'space-between',
        flexDirection:"row",
        alignItems:'center',
        width:'100%'
    }
})