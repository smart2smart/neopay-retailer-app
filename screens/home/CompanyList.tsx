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
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import commonStyles from "../../styles/commonStyles";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import RenderCompanyCard from "./CompanyCard";
import {BorderButtonBigBlue} from "../../buttons/Buttons";
import SeeAllCompaniesModal from "./SeeAllCompaniesModal";


function CompanyList(props) {
    let _ = require('underscore');
    const route = useRoute();
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [originalProductsData, setOriginalProductsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [companyData, setCompanyData] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const [originalBrandData, setOriginalBrandData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [category2Data, setCategory2Data] = useState([]);
    const [originalCategory2Data, setOriginalCategory2Data] = useState([]);
    const [originalCategoryData, setOriginalCategoryData] = useState([]);
    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [companyModalVisible, setCompanyModalVisible] = useState(false);
    const [brandModalVisible, setBrandModalVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const distributor = useSelector((state: any) => state.distributor);
    const retailerData = useSelector((state: any) => state.retailerDetails);

    useEffect(() => {
        if (distributor) {
            getProductsData();
        }
    }, [distributor]);

    const getProductsData = () => {
        const dataToSend = {
            method: commonApi.getProducts.method,
            url: commonApi.getProducts.url + '?retailer_id=' + retailerData.id + "&distributor_id=" + distributor.user,
            header: commonApi.getProducts.header
        }
        setIsLoading(true)
        AuthenticatedGetRequest(dataToSend).then((res) => {
            let companies = _.chain(res.data).groupBy("company_id").map((value, key) => ({
                name: value[0]["company_name"],
                id: value[0]["company_id"],
                image: value[0]["company_image"],
                type: "company"
            })).value().filter((item) => {
                return item.id
            })
            setCompanyData(companies);

            let brands = _.chain(res.data).groupBy("brand_id").map((value, key) => ({
                name: value[0]["brand_name"],
                id: value[0]["brand_id"],
                image: value[0]["brand_image"],
                company_id: value[0]["company_id"],
                type: "brand"
            })).value().filter((item) => {
                return item.id
            })
            setBrandData(brands)
            setOriginalBrandData(brands);

            let categories = _.chain(res.data).groupBy("category_1_id").map((value, key) => ({
                name: value[0]["category_1_name"],
                id: value[0]["category_1_id"],
                image: value[0]["category_1_image"],
                type: "category"
            })).value().filter((item) => {
                return item.id
            })
            setCategoryData(categories);
            setOriginalCategoryData(categories);

            let category2 = _.chain(res.data).groupBy("category_2_id").map((value, key) => ({
                name: value[0]["category_2_name"],
                id: value[0]["category_2_id"],
                image: value[0]["category_2_image"],
                category_1_id: value[0]["category_1_id"],
                type: "category"
            })).value().filter((item) => {
                return item.id
            })
            setCategory2Data(category2);
            setOriginalCategory2Data(category2);


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
        })
    }

    const selectCategory = (category, itm) => {
        setModalVisible(category);
        setIsCategorySelected(true);
        setSelectedCategory(itm);
        if (category == "company") {
            let data = brandData.filter((item) => {
                return itm.id === item.company_id;
            })
            navigation.navigate("BrandList", {type: "brand", categoryData: data, productData: productsData})
        }
        if (category == "category") {
            let data = category2Data.filter((item) => {
                return itm.id === item.category_1_id;
            })
            navigation.navigate("BrandList", {type: "brand", categoryData: data, productData: productsData})
        }
        if (category == "brand") {
            let data = productsData.filter((itm) => {
                return itm.brand_id == item.id;
            })
            navigation.navigate("BuildOrder", {type: "brand", categoryData:data, productData: data})
        }
    }


    const RenderList = (props) => {
        return (
            <View>
                <View style={[commonStyles.rowSpaceBetween, styles.companyHeader]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={[texts.greyTextBold16]}>
                            {props.title}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={props.seeAll}>
                        <Text style={texts.redTextBold14}>
                            See All
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={props.data.slice(0, 6)}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    ItemSeparatorComponent={() => <View style={{height: 16}}></View>}
                    keyExtractor={(item, index) => item.id + index + ""}
                    renderItem={(item) => props.renderItem(item, props)}/>

                {props.modalVisible ? <SeeAllCompaniesModal
                    modalVisible={props.modalVisible}
                    selectFunction={selectCategory}
                    closeModal={setModalVisible}
                    renderItem={RenderCompanyCard}
                    data={props.data} type={props.type}/> : null}
            </View>
        )
    }

    const goToBuildOrder = () => {
        navigation.navigate("BuildOrder", {productData: originalProductsData})
    }

    const setModalVisible = (type) => {
        if (type == "company") {
            setCompanyModalVisible(prevState => !prevState)
        }
        if (type == "brand") {
            setBrandModalVisible(prevState => !prevState)
        }
        if (type == "category") {
            setCategoryModalVisible(prevState => !prevState)
        }
    }


    return (
        <View style={{flex: 1}}>
            <Indicator isLoading={isLoading}/>
            {!isLoading ? <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                    <View>
                        <View style={{paddingBottom: 20}}>
                            <RenderList modalVisible={companyModalVisible} seeAll={() => {
                                setModalVisible("company")
                            }} selectFunction={selectCategory} type={"company"} title={"Companies"}
                                        data={companyData}
                                        renderItem={RenderCompanyCard}/>
                            <RenderList modalVisible={brandModalVisible} seeAll={() => {
                                setModalVisible("brand")
                            }} selectFunction={selectCategory} type={"brand"}
                                        title={"Brands"} data={brandData}
                                        renderItem={RenderCompanyCard}/>
                            <RenderList modalVisible={categoryModalVisible} seeAll={() => {
                                setModalVisible("category")
                            }} selectFunction={selectCategory}
                                        type={"category"} title={"Categories"}
                                        data={categoryData}
                                        renderItem={RenderCompanyCard}/>
                            <View style={{marginTop: 20}}>
                                <BorderButtonBigBlue ctaFunction={goToBuildOrder} text={"All Products"}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
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
        paddingTop: 12,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey,
        marginBottom: 12
    }
});

export default connect(mapStateToProps, {})(CompanyList);
