import React, {useEffect, useState} from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
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
import AddProductButton from "./AddProductButton";
import {connect, useSelector, useDispatch} from "react-redux";
import mapStateToProps from "../../store/mapStateToProps";
import {
    updateCartAdd,
    updateCartSubtract,
    removeFromCart,
    clearCart,
    cartChangeQuantity, changeLotSize,
} from "../../actions/actions";
import CartButton from "../../commons/CartButton";
import PersistenceStore from "../../utils/PersistenceStore";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import {set_unit_quantities} from "./ProductUtils";
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import QPSModal from "../../commons/QPSMOdal";
import {RenderItem} from "./ProductCard";

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
    const dispatch = useDispatch()
    let _ = require("underscore");
    const route = useRoute();
    const cart = useSelector((state: any) => state.cart);
    const [searchText, setSearchText] = useState("");
    const [productsData, setProductsData] = useState([]);
    const [originalProductsData, setOriginalProductsData] = useState([]);
    const [loading, setIsLoading] = useState(false);
    const distributor = useSelector((state: any) => state.distributor);
    const retailerData = useSelector((state: any) => state.retailerDetails);
    const [normalView, setNormalView] = useState(true);
    let filters = useSelector((state: any) => state.filters);
    const [qpsModalVisible, setQPSModalVisible] = useState(false);
    const [qpsData, setQPSData] = useState({});

    const getProductsData = () => {
        const dataToSend = {
            method: commonApi.getProducts.method,
            url:
                commonApi.getProducts.url +
                "?retailer_id=" +
                retailerData.id +
                "&distributor_id=" +
                distributor.user,
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

    const toggleView = () => {
        setNormalView(prevState => !prevState);
        if (normalView) {
            let data = [...productsData];
            data.forEach((item) => {
                item.collapsed = false;
            });
            setProductsData(data);
        } else {
            let data = [...productsData];
            data.forEach((item) => {
                item.collapsed = true;
            });
            setProductsData(data);
        }
    };

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

    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let payload = {retailerId: retailerData.id, distributorId: distributor.user}
        let allProducts = [...productsData];
        let entity = allProducts[mainIndex]["data"][subIndex];
        entity["quantity"] = text;
        entity["open"] = false;
        entity["selectedDropDownValue"] = text;
        let {current_rate} = get_current_rate(entity, parseInt(text), entity.lot_quantity)
        entity["current_rate"] = current_rate
        payload["product"] = entity
        setProductsData(allProducts);

        dispatch(cartChangeQuantity(payload))
    };

    const selectProductAlert = (data, type, mainIndex, subIndex) => {
        if (cart.distributorId && cart.distributorId !== distributor.user) {
            Alert.alert(
                "Change Distributor",
                `You have items in your cart from another distributor. Adding new distributor will clear your cart. Are you sure you want to continue?`,
                [
                    {
                        text: "Yes",
                        onPress: () => {
                            props.clearCart();
                            PersistenceStore.removeCart();
                            selectProduct(data, type, mainIndex, subIndex);
                        },
                    },
                    {
                        text: "No",
                        onPress: () => {
                        },
                    },
                ],
                {cancelable: false}
            );
        } else {
            selectProduct(data, type, mainIndex, subIndex);
        }
    };

    const get_current_rate = (entity, quantity, lot_quantity) => {
        let min_qty = 0;
        let current_rate = entity.rate;
        let least_rate = entity.rate;
        if (entity.qps.length > 0) {
            entity.qps.forEach((qps) => {
                if (qps.min_qty * lot_quantity >= min_qty) {
                    least_rate = parseFloat(parseFloat(entity.rate) * (1 - qps.discount_rate / 100)).toFixed(2)
                }
                if (quantity * lot_quantity >= qps.min_qty) {
                    current_rate = parseFloat(parseFloat(entity.rate) * (1 - qps.discount_rate / 100)).toFixed(2)
                }
            })
        }
        return {current_rate, least_rate}
    }

    const selectUnitDropdown = (mainIndex, subIndex, lotSizeId, lotQuantity, unitLabel) => {
        let payload = {distributorId: distributor.user};
        let allProducts = [...productsData];
        let entity = allProducts[mainIndex]["data"][subIndex];
        let {current_rate} = get_current_rate(entity, entity.quantity, lotQuantity)
        entity["current_rate"] = current_rate;
        entity["selected_unit"] = lotSizeId;
        entity["lot_quantity"] = lotQuantity;
        entity["unit_label"] = unitLabel;
        payload["product"] = entity;
        setProductsData(allProducts);
        dispatch(changeLotSize(payload))
    }

    const selectProduct = (data, type, mainIndex, subIndex) => {
        let payload = {retailerId: retailerData.id, distributorId: distributor.user}
        let allProducts = [...productsData];
        let entity = allProducts[mainIndex]["data"][subIndex];
        if (type === "new") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = 1;
            let {current_rate} = get_current_rate(entity, 1, entity["lot_quantity"]);
            entity["current_rate"] = current_rate
            payload["product"] = entity;
            dispatch(updateCartAdd(payload))
        } else if (type == "add") {
            entity["quantity"] = data.quantity ? parseInt(entity["quantity"]) + 1 : 1;
            let {current_rate} = get_current_rate(entity, entity.quantity, entity["lot_quantity"]);
            entity["current_rate"] = current_rate
            payload["product"] = entity;
            dispatch(updateCartAdd(payload))
        } else if (type == "subtract") {
            if (entity["quantity"] > 1) {
                entity["quantity"] = parseInt(entity["quantity"]) - 1;
                let {current_rate} = get_current_rate(entity, entity.quantity, entity["lot_quantity"]);
                entity["current_rate"] = current_rate
                payload["product"] = entity;
                dispatch(updateCartSubtract(payload))
            } else {
                entity["quantity"] = 0;
                let {current_rate} = get_current_rate(entity, 1, entity["lot_quantity"]);
                entity["current_rate"] = current_rate
                payload["product"] = entity;
                dispatch(removeFromCart(payload))
            }
        }
        setProductsData(allProducts);
    };

    const expandImage = (mainIndex, subIndex) => {
        let allProducts = [...productsData];
        allProducts[mainIndex]["data"][subIndex]["image_expanded"] =
            !allProducts[mainIndex]["data"][subIndex]["image_expanded"];
        setProductsData(allProducts);
    };

    const expandProductGroupImage = (mainIndex) => {
        let allProducts = [...productsData];
        allProducts[mainIndex]["pg_image_expanded"] =
            !allProducts[mainIndex]["pg_image_expanded"];
        setProductsData(allProducts);
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
                get_current_rate={get_current_rate}
                expandProductGroupImage={expandProductGroupImage}
                handleCollapse={handleCollapse}
                item={item} index={index}/>
        )
    }

    return (
        <View style={{flex: 1, paddingHorizontal: 12, backgroundColor: colors.white}}>
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
