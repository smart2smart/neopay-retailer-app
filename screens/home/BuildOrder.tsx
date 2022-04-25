import React, {useEffect, useState} from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
    Dimensions,
} from "react-native";
import SecondaryHeader from "../../headers/SecondaryHeader";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import commonStyles from "../../styles/commonStyles";
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import AntDesign from "react-native-vector-icons/AntDesign";
import {connect, useSelector, useDispatch} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import CartButton from "../../commons/CartButton";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import {set_unit_quantities} from "./ProductUtils";
import QPSModal from "../../commons/QPSMOdal";
import {RenderItem} from "./ProductCard";
import useProductsHook from "../custom-hooks/useProductsHook";
import Indicator from "../../utils/Indicator";

const sku_units = {
    1: "kg",
    2: "g",
    3: "ml",
    4: "ltr",
    5: "pcs",
    6: "strip",
    7: "pack",
    8: "tablet",
    9: "box",
    10: "bag",
};

const screenHeight = Dimensions.get('window').height
let dropdownPadding = screenHeight * 0.035;

function BuildOrder(props) {
    let _ = require("underscore");
    const route = useRoute();
    const cart = useSelector((state: any) => state.cart);
    const [searchText, setSearchText] = useState("");
    const [loading, setIsLoading] = useState(false);
    const distributor = useSelector((state: any) => state.distributor);
    let filters = useSelector((state: any) => state.filters);
    const [qpsModalVisible, setQPSModalVisible] = useState(false);
    const [qpsData, setQPSData] = useState({});
    const retailerData = useSelector((state: any) => state.retailerDetails);

    const {productsData,
        setProductsData,
        originalProductsData,
        setOriginalProductsData,
        expandImage,
        expandProductGroupImage,
        toggleView,
        selectUnitDropdown,
        selectProduct,
        setProductQuantity,
        normalView,
        selectProductAlert
    } = useProductsHook("buildOrder", [])

    const getProductsData = () => {
        const dataToSend = {
            method: commonApi.getProducts.method,
            url:
                commonApi.getProducts.url +
                "?retailer_id=" +
                retailerData.id +
                "&distributor_id=" +
                distributor.id,
            header: commonApi.getProducts.header,
        };
        setIsLoading(true);
        // @ts-ignore
        AuthenticatedGetRequest(dataToSend).then((res) => {
            let groupedData = _.chain(res.data)
                .groupBy("product_group_id")
                .map((value, key) => ({
                    company_name: value[0]["company_name"],
                    company_id: value[0]["company_id"],
                    company_image: value[0]["company_image"],
                    brand_id: value[0]["brand_id"],
                    brand_name: value[0]["brand_name"],
                    brand_image: value[0]["brand_image"],
                    category_1_id: value[0]["category_1_id"],
                    category_1_name: value[0]["category_1_name"],
                    category_1_image: value[0]["category_1_image"],
                    category_2_id: value[0]["category_2_id"],
                    category_2_name: value[0]["category_2_name"],
                    category_2_image: value[0]["category_2_image"],
                    image: value[0]["product_group_image"],
                    product_group: key,
                    image_expanded: false,
                    product_group_id: value[0]["product_group_id"],
                    data: value,
                    pg_image_expanded: false,
                    quantity: 0,
                    collapsed: normalView,
                }))
                .value();
            groupedData = _.sortBy(groupedData, function (item) {
                return item.company_name;
            })
            setIsLoading(false);
            groupedData.forEach((item) => {
                item.data.forEach((product) => {
                    set_unit_quantities(product)
                })
            })
            setProductsData(groupedData);
            setOriginalProductsData(groupedData);
            if (cart.count > 0) {
                matchQuantityWithCart(groupedData);
            }
        });
    };

    const handleCollapse = (index) => {
        let data = [...productsData];
        data[index].collapsed = !data[index].collapsed;
        setProductsData(data);
    };


    useEffect(() => {
        if (route.params) {
            if (route.params.productData) {
                let data = route.params.productData
                setProductsData(data);
                setOriginalProductsData(data);
                matchQuantityWithCart(data);
            }
        } else {
            getProductsData();
        }
    }, []);


    const applyFilters = () => {
        let filteredData = originalProductsData.map((item: any) => {
            return {
                ...item,
                data: item.data.filter((product: any) => {
                    let productMargin =
                        ((product.mrp - product.rate) / product.rate) * 100;
                    return (
                        productMargin >= filters.margin.from &&
                        productMargin <= filters.margin.to
                    );
                }),
            };
        });
        let removeBoolean = filteredData.filter((item) => {
            return item.data.length > 0;
        });
        removeBoolean.forEach((item) => {
            item["collapsed"] = true;
        });
        setProductsData(removeBoolean);
    };
    const applyFiltersLink = async () => {
        let filteredData = (route?.params?.productData).map((item: any) => {
            return {
                ...item,
                data: item.data.filter((product: any) => {
                    let productMargin =
                        ((product.mrp - product.rate) / product.rate) * 100;
                    return (
                        productMargin >= filters.margin.from &&
                        productMargin <= filters.margin.to
                    );
                }),
            };
        });
        let removeBoolean = filteredData.filter((item) => {
            return item.data.length > 0;
        });
        removeBoolean.forEach((item) => {
            item["collapsed"] = true;
        });
        setProductsData(removeBoolean);
    };

    useEffect(() => {
        if (route.params) {
            if (route.params.comingFrom === "filters") {
                applyFilters();
            }
            if (route.params.comingFrom === "filters-link") {
                applyFiltersLink();
            }
        }
        if (route.params) {
            if (route.params.comingFrom === "clearfilters") {
                setProductsData(originalProductsData);
                productsData.forEach((item) => {
                    item["collapsed"] = true;
                });
            }
        }
    }, [filters]);

    useEffect(() => {
        if (route.params) {
            if (route.params.comingFrom === "clearfilters") {
                setProductsData(originalProductsData);
                productsData.forEach((item) => {
                    item["collapsed"] = true;
                });
            }
        }
    });


    const matchQuantityWithCart = (items) => {
        let groupedData = [...items];
        let data = {}
        Object.values(cart.data).forEach((item) => {
            data[item.id] = {
                quantity: item.quantity,
                selected_unit: item["selected_unit"],
                current_rate: item["current_rate"],
                lot_quantity: item["lot_quantity"],
                unit_label: item["unit_label"],
            };
        })
        groupedData.forEach((item) => {
            item.data.forEach((itm) => {
                if (data[itm.id]) {
                    itm["quantity"] = data[itm.id]["quantity"]
                    itm["selected_unit"] = data[itm.id]["selected_unit"]
                    itm["current_rate"] = data[itm.id]["current_rate"]
                    itm["lot_quantity"] = data[itm.id]["lot_quantity"]
                    itm["unit_label"] = data[itm.id]["unit_label"]
                } else {
                    itm["quantity"] = 0;
                }
            })
        })
    };

    const searchProduct = (text) => {
        setSearchText(text);
        if (text === "") {
            setProductsData(originalProductsData);
        } else {
            let filteredData = originalProductsData.map((item) => {
                return {
                    ...item,
                    data: item.data.filter((itm) => {
                        return (
                            itm.name.toLowerCase().includes() ||
                            (itm.brand_name &&
                                itm.brand_name.toLowerCase().includes(text.toLowerCase())) ||
                            (itm.company_name &&
                                itm.company_name.toLowerCase().includes(text.toLowerCase())) ||
                            (itm.product_group &&
                                itm.product_group.toLowerCase().includes(text.toLowerCase())) ||
                            (itm.variant &&
                                itm.variant.toLowerCase().includes(text.toLowerCase()))
                        );
                    }),
                };
            });
            let removeBoolean = filteredData.filter((item) => {
                return item.data.length > 0;
            });
            setProductsData([...removeBoolean]);
        }
    };

    const renderItem = ({item, index}) => {
        return (
            <RenderItem
                setQPSModalVisible={setQPSModalVisible}
                setQPSData={setQPSData}
                selectUnitDropdown={selectUnitDropdown}
                setProductQuantity={setProductQuantity}
                selectProductAlert={selectProductAlert}
                expandImage={expandImage}
                expandProductGroupImage={expandProductGroupImage}
                handleCollapse={handleCollapse}
                item={item} index={index}/>
        )
    }

    return (
        <View style={{flex: 1, paddingHorizontal: 12, backgroundColor: colors.white}}>
            <Indicator isLoading={loading}/>
            <View style={commonStyles.rowSpaceBetween}>
                <SecondaryHeader headerRight={true} headerRightTitle={normalView ? "Detailed View" : "Normal View"}
                                 headerRightCta={toggleView} title={"Create Order"}/>
            </View>
            <View style={[commonStyles.searchContainer, {marginTop: 10, marginBottom: 10}]}>
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
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
                <Text style={[texts.blueBoldl14]}>
                    {productsData.length} item(s) found
                </Text>
                <TouchableOpacity style={styles.filterBox}
                                  onPress={() => props.navigation.navigate("ProductFilterScreen")}>
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
                ItemSeparatorComponent={() => <View style={{height: 4}}></View>}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item.product_group_id + "" + item.product_group_name}
                renderItem={renderItem}
                ListFooterComponent={() => <View style={{paddingBottom: 50}}></View>}
            />
            {cart.count > 0 ? <CartButton/> : null}
            {qpsModalVisible ? <QPSModal
                modalVisible={qpsModalVisible}
                data={qpsData}
                closeModal={() => {
                    setQPSModalVisible(false);
                }}/> : null}
        </View>
    );
}

export default connect(mapStateToProps, {})(BuildOrder);

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
        paddingBottom: 5
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
        padding: 1,
        borderColor: colors.grey,
        backgroundColor: colors.white,
        marginRight: 6,
        width: 25
    },
    filterBox: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.red,
        backgroundColor: colors.white,
        padding: 8
    },
    rowSpaceBetween: {
        justifyContent: 'space-between',
        flexDirection: "row",
        alignItems: 'center',
        width: '100%'
    },
    dropdown: {
        backgroundColor: 'white',
        marginTop: 4,
        borderRadius: 4,
        height: 20,
        width: 80,
        alignSelf: "flex-end",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: colors.red,
        paddingLeft: 5,
    },
    dropdownContainer: {
        borderRadius: 4,
        marginTop: -dropdownPadding
    },
    qpsDiv: {
        marginTop: 8,
        backgroundColor: 'rgba(169, 41, 79, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: "flex-start"
    },
});
