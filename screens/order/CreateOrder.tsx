import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    FlatList,
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
import { BorderButtonSmallBlue, SolidButtonBlue, BorderButtonSmallRed } from '../../buttons/Buttons';
import {commonApi} from "../../api/api";
import { AuthenticatedGetRequest } from "../../api/authenticatedGetRequest";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

export default function CreateOrder({route}) {

    // if(route && route.params) {
    //     const {distributorID} =route.params;
    // }

    const mockData=
    {
        count: 2,
        next: null,
        previous: null,
        results: [
            {
                id: 3355,
                company_name: "Johnsons&Johnsons",
                company_code: "J&J",
                product_group: "Facewash",
                variant: "Clean & Clear Facewash",
                sku: "Clean & Clear Facewash 50gm",
                name: "oil",
                description: "qsdfghtrdx",
                mrp: "500.00",
                rate: "399.99",
                value: 2,
                code: "lkvcsakn87",
                promotion_type: "",
                promotion_value: 0,
                created_at: "2021-07-15T17:13:51.226119+05:30",
                updated_at: "2021-07-15T17:13:51.226199+05:30",
                archieved: false,
                hsn_code: "",
                gst_rate: "5.00",
                admin: 11,
                distributor: 25943
            },
            {
                id: 3354,
                company_name: "Johnsons&Johnsons",
                company_code: "J&J",
                product_group: "Facewash",
                variant: "Clean & Clear Facewash",
                sku: "Clean & Clear Facewash 50gm",
                name: "peach",
                description: "",
                mrp: "1100.00",
                rate: "1000.00",
                value: 3,
                code: "",
                promotion_type: "",
                promotion_value: 0,
                created_at: "2021-07-06T16:55:21.235370+05:30",
                updated_at: "2021-07-13T16:35:21.816461+05:30",
                archieved: false,
                hsn_code: "",
                gst_rate: "18.00",
                admin: 25968,
                distributor: 25943
            }
        ]
    }
    
    const navigation = useNavigation();
    const [showSearch, setShowSearch] = useState(false);
    const [productData, setProductData] = useState(mockData);
    const [distributorID, setDistributorID] = useState(route.params);

    const showSearchBar = () => {
        setShowSearch(true);
        if (showSearch === true) setShowSearch(false);
    };

    const homePage = () => {
        navigation.navigate("HomeScreen");
    }

    useEffect(() => {
        // getproductData(distributorID);
    }, []);

    const getproductData = (distributorID) => {
        const distributorId = distributorID.distributorID;
        const data = {
            method: commonApi.getDistributorproducts.method,
            url: commonApi.getDistributorproducts.url+distributorId+'/',
            header: commonApi.getDistributorproducts.header
        }
        // @ts-ignore
        AuthenticatedGetRequest(data).then((res) => {
            setProductData(res.data);
            console.log('@@@@@@@@@@@@@@@@@', res);
        })
    }

    const selectProduct = (index: number, item, type: string) => {
        let data = item;
        const productDataMap = {...productData};
        let quantity = productDataMap.results[index].value;
    
        if (type === "add") {
          quantity = quantity == "" ? 1 : parseInt(quantity) + 1;
        } else {
          if (quantity > 0) {
            quantity = parseInt(quantity) - 1;
          }
        }
        productDataMap.results[index].value = quantity;
        setProductData(productDataMap);
    }

    const setProductQuantity = (item, text) => {
        let data = item;
        data.value = text;
        setProductData(data);
    }

    const productDescription = (item, index) => {
        return(
            <View style={{marginTop:25}}>
                <View style={[commonStyles.row, {marginBottom:10}]}>
                    <View>
                        <Image style={styles.cardImage} source={require("../../assets/images/adaptive-icon.png")}/>
                    </View>
                    <View style={{marginLeft:16}}>
                        <Text style={texts.greyNormal10}>{item.company_code} {'>'}</Text>
                        <Text style={texts.blackTextBold14}>{item.variant}</Text>
                    </View>
                </View>
                <View style={commonStyles.rowSpaceBetween}>
                    <Text style={texts.greyTextBold12}>{item.sku}</Text>
                    {item.value === 0 ?
                    <BorderButtonSmallRed ctaFunction={() => {
                        selectProduct(index, item, "add")
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
            </View>
        );
    }
    
    
    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <View style={commonStyles.rowSpaceBetween}>
                <SecondaryHeader title={"Create Order"}/>
                <TouchableOpacity style={{ marginTop: 24 }} onPress={() => {showSearchBar()}}>
                    <Icon name="search" size={24} color={colors.blue} />
                </TouchableOpacity>
            </View>
            {showSearch && (<View style={[commonStyles.searchContainer, { marginTop: 24 }]}>
                <TextInput
                    maxLength={10}
                    placeholder={"Search for Products"}
                    style={commonStyles.textInput}
                />
                </View>
            )}
            <FlatList
            data={productData.results}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.name + ""}
            renderItem={({item, index}) =>productDescription(item, index)}
          />
            <View style={commonStyles.rowFlexEnd}>
                <SolidButtonBlue text={'SAVE'} ctaFunction={homePage}/>
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