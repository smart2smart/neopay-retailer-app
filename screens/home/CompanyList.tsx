import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    FlatList,
    Image,
    Dimensions,
    ScrollView
} from 'react-native';
import {commonApi} from "../../api/api";
import {AuthenticatedGetRequest} from "../../api/authenticatedGetRequest";
import Indicator from "../../utils/Indicator";
import {connect, useSelector} from 'react-redux';
import mapStateToProps from "../../store/mapStateToProps";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import SecondaryHeader from "../../headers/SecondaryHeader";
import commonStyles from "../../styles/commonStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import ToggleView from "./ToggleView";
import {BuildOrder} from "./BuildOrder";


export function CompanyList(props) {
    let _ = require('underscore');
    const route = useRoute();
    const [data, setData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [originalProductsData, setOriginalProductsData] = useState([]);
    const [selectedTab, setSelectedTab] = useState("tab");
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [companyData, setCompanyData] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const [originalBrandData, setOriginalBrandData] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [category2Data, setCategory2Data] = useState([]);
    const [originalCategory2Data, setOriginalCategory2Data] = useState([]);
    const [originalCategoryData, setOriginalCategoryData] = useState([]);
    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [comingFrom, setComingFrom] = useState("");
    const distributor = useSelector((state: any) => state.distributor);
    const retailerData = useSelector((state: any) => state.retailerDetails);


    useEffect(() => {
        getProductsData();
        setData(route.params.data);
    }, []);

    const getProductsData = () => {
        const dataToSend = {
            method: commonApi.getProducts.method,
            url: commonApi.getProducts.url + '?retailer_id=' + retailerData.id + "&distributor_id=" + distributor.user,
            header: commonApi.getProducts.header
        }
        setIsLoading(true)
        // @ts-ignore
        AuthenticatedGetRequest(dataToSend).then((res) => {
            console.log(res)
            let groupedData = _.chain(res.data)
                .sortBy(function (item) {
                    return item.company_name;
                })
                .groupBy("product_group")
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
                    image: value[0]["product_group_image"],
                    product_group: key,
                    image_expanded: false,
                    product_group_id: value[0]["product_group_id"],
                    data: value,
                    pg_image_expanded: false,
                    quantity: 0
                })).value()
            setIsLoading(false);
            setValues(groupedData);
            if (route.params.comingFrom == "edit") {
                matchQuantities(groupedData);
            } else {
                setProductsData(groupedData);
                setOriginalProductsData(groupedData);
            }
        })
    }

    const matchQuantities = (groupedData) => {
        let items = {};
        let count = 0;

        let data = groupedData.map((item) => {
            return {
                ...item, data: item.data.filter((itm) => {
                    return items[itm.id]
                })
            }
        }).filter((item) => {
            return item.data.length > 0
        })

        data.forEach((item) => {
            item.data.forEach((itm) => {
                if (items[itm.id]) {
                    itm.quantity = items[itm.id]
                }
            })
        })
        setProductsData(data);
        setOriginalProductsData(data);
        setProductCount(count);
        setSelectedTab("list");
        setComingFrom("edit");
    }


    const setValues = (groupedData) => {
        let companies = [];
        let brands = [];
        let categories = [];
        let categories2 = [];
        groupedData.forEach((item) => {
            if (item.company_id) {
                companies.push({
                    id: item.company_id,
                    name: item.company_name,
                    image: item.company_image,
                    type: 'company'
                })
            }
            if (item.brand_id) {
                brands.push({
                    id: item.brand_id,
                    name: item.brand_name,
                    image: item.brand_image,
                    type: 'brand',
                    company_id: item.company_id
                })
            }
            if (item.category_1_id) {
                categories.push({
                    id: item.category_1_id,
                    name: item.category_1_name,
                    image: item.category_1_image,
                    type: 'category '
                })
            }
            if (item.category_2_id) {
                categories.push({
                    id: item.category_2_id,
                    category_1_id: item.category_1_id,
                    name: item.category_2_name,
                    type: 'category'
                })
            }
        })
        setCompanyData(companies);
        setBrandData(brands);
        setOriginalBrandData(brands);
        setCategoryData(categories);
        setOriginalCategoryData(categories);
        setCategory2Data(categories);
        setOriginalCategory2Data(categories);
    }

    const searchItem = (text) => {
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
            setSearching(true);
            setProductsData([...removeBoolean]);
        }
    }

    const applyFilters = (type, item) => {
        if (type === "brand") {
            let data = productsData.filter((itm) => {
                return itm.brand_id == item.id;
            })
            setProductsData([...data]);
            setSelectedTab("list")
        }
        if (type === "category") {
            let data = productsData.filter((itm) => {
                return itm.category_2_id == item.id;
            })
            setProductsData([...data]);
            setSelectedTab("list")
        }
    }

    const selectCategory = (category, itm) => {
        setIsCategorySelected(true);
        setSelectedCategory(itm);
        if (category == "company") {
            let data = brandData.filter((item) => {
                return itm.id === item.company_id;
            })
            setBrandData([...data]);
        }
        if (category == "category") {
            let data = category2Data.filter((item) => {
                return itm.id === item.category_1_id;
            })
            setCategory2Data([...data]);
        }
        if (category == "brand") {
            applyFilters("brand", itm)
        }
    }

    const RenderCompanyCard = ({item, index}, props) => {
        let padding = (Dimensions.get("window").width - 48) * 0.1 / 2;
        return (
            <TouchableOpacity onPress={() => {
                props.selectFunction(item.type, item)
            }} style={[styles.companyCard, (index + 1) % 3 !== 0 ? {marginRight: padding} : {}]}>
                <Image style={{width: "84%", height: "84%"}} resizeMode={"contain"} source={{uri:item.image}}/>
            </TouchableOpacity>
        )
    }


    const RenderList = (props) => {
        return (
            <View>
                <View style={[commonStyles.rowSpaceBetween, styles.companyHeader]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        {props.back ? <TouchableOpacity onPress={() => {
                            setIsCategorySelected(false);
                            setBrandData(originalBrandData);
                            setCategory2Data(originalCategory2Data);
                        }}>
                            <AntDesign name="arrowleft" size={24} color={colors.red}/>
                        </TouchableOpacity> : null}
                        <Text style={[texts.greyTextBold16, {marginLeft: 10}]}>
                            {props.title}
                        </Text>
                    </View>
                    <View>
                        <Text style={texts.redTextBold14}>
                            See All
                        </Text>
                    </View>
                </View>
                <FlatList
                    data={props.data.slice(0, 6)}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    ItemSeparatorComponent={() => <View style={{height: 16}}></View>}
                    keyExtractor={item => item.id}
                    renderItem={(item) => props.renderItem(item, props)}/>
            </View>
        )
    }

    const selectTab = (tab) => {
        setSelectedTab(tab)
    }


    return (
        <View style={{flex: 1}}>
            <Indicator isLoading={isLoading}/>
            <View style={styles.container}>
                <View style={[commonStyles.rowSpaceBetween, {marginTop: 10}]}>
                    <SecondaryHeader title={comingFrom == "edit" ? "Edit Order" : "Browse Menu"}/>
                    {comingFrom !== "edit" ? <ToggleView selectTab={selectTab} selectedTab={selectedTab}/> : null}
                </View>
                {comingFrom !== "edit" ? <View style={[commonStyles.searchContainer, {marginTop: 16}]}>
                    <TextInput
                        value={searchText}
                        placeholder={"Search products, companies, brands..."}
                        onChangeText={(text) => searchItem(text)}
                        style={commonStyles.textInput}>
                    </TextInput>
                    {searchText !== "" ? <TouchableOpacity onPress={() => searchItem('')}
                                                           style={{position: "absolute", right: 0, padding: 10}}>
                        <AntDesign name="close" size={18} color={colors.black}/>
                    </TouchableOpacity> : null}
                </View> : null}
                {searching || selectedTab == "list" ?
                    <BuildOrder
                        productCount={productCount}
                        comingFrom={comingFrom}
                        retailerData={data}
                        productsData={productsData}/> :
                    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                        {isCategorySelected ? <View>
                            {selectedCategory.type == "company" ?
                                <RenderList selectFunction={applyFilters} back={true}
                                            title={selectedCategory.name} data={brandData}
                                            renderItem={RenderCompanyCard}/> : null}
                            {selectedCategory.type == "category" ?
                                <RenderList selectFunction={applyFilters} back={true}
                                            title={selectedCategory.name} data={category2Data}
                                            renderItem={RenderCompanyCard}/> : null}
                        </View> : <View style={{paddingBottom: 20}}>
                            <RenderList selectFunction={selectCategory} title={"Companies"}
                                        data={companyData}
                                        renderItem={RenderCompanyCard}/>
                            <RenderList selectFunction={selectCategory} title={"Brands"} data={brandData}
                                        renderItem={RenderCompanyCard}/>
                            <RenderList selectFunction={selectCategory} title={"Categories"} data={categoryData}
                                        renderItem={RenderCompanyCard}/>
                        </View>}
                    </ScrollView>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        position: 'relative',
        flex: 1,
        backgroundColor: colors.white
    },
    companyCard: {
        height: 100,
        width: "30%",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.light_grey,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryCard: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.light_grey,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10
    },
    companyHeader: {
        paddingTop: 20,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey,
        marginBottom: 16
    }
});

export default connect(mapStateToProps, {})(CompanyList);
