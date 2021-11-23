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
import Indicator from "../../utils/Indicator";
import {connect, useSelector} from 'react-redux';
import mapStateToProps from "../../store/mapStateToProps";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import SecondaryHeader from "../../headers/SecondaryHeader";
import commonStyles from "../../styles/commonStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import RenderCompanyCard from "./CompanyCard";


function BrandList(props) {
    let _ = require('underscore');
    const navigation = useNavigation();
    const route = useRoute();
    const [data, setData] = useState([]);
    const [type, setType] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const distributor = useSelector((state: any) => state.distributor);

    useEffect(() => {
        if (route.params) {
            if (route.params.productData) {
                setData(route.params.productData);
            }
            if (route.params.type) {
                setType(route.params.type);
            }
        }
    }, [])

    const RenderList = (props) => {
        return (
            <View>
                <View style={[commonStyles.rowSpaceBetween, styles.companyHeader]}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        {props.back ? <TouchableOpacity onPress={() => {
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

    const searchItem = () => {

    }

    const selectCategory = (itemType, item) => {
        if (type === "brand") {
            let productData = data.filter((itm) => {
                return itm.brand_id == item.id;
            })
            navigation.navigate("BuildOrder", {type: "brand", productData: productData})
        }
        if (type === "category") {
            let productData = data.filter((itm) => {
                return itm.category_2_id == item.id;
            })
            navigation.navigate("BuildOrder", {type: "category", productData: data})
        }
    }


    return (
        <View style={{flex: 1}}>
            <Indicator isLoading={isLoading}/>
            <View style={styles.container}>
                <View style={[commonStyles.rowSpaceBetween, {marginTop: 10}]}>
                    <SecondaryHeader title={"Browse Menu"}/>
                </View>
                <View style={[commonStyles.searchContainer, {marginTop: 16}]}>
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
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                    <View style={{paddingBottom: 20}}>
                        <RenderList selectFunction={selectCategory}
                                    title={type === "brand" ? "Brands" : "Categories"}
                                    data={data}
                                    renderItem={RenderCompanyCard}/>
                    </View>
                </ScrollView>
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

export default connect(mapStateToProps, {})(BrandList);
