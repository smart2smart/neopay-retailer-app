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
import {connect, useSelector} from 'react-redux';
import mapStateToProps from "../../store/mapStateToProps";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import SecondaryHeader from "../../headers/SecondaryHeader";
import commonStyles from "../../styles/commonStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../../assets/colors/colors";
import texts from "../../styles/texts";
import RenderCompanyCard from "./CompanyCard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


function BrandList(props) {
    let _ = require('underscore');
    const navigation = useNavigation();
    const route = useRoute();
    const [data, setData] = useState([]);
    const [type, setType] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (route.params) {
            if (route.params.productData) {
                setData(route.params.productData);
            }
            if (route.params.type) {
                setType(route.params.type);
            }
        }
    }, []);

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
            navigation.navigate("BuildOrder", {type: "category", productData: productData})
        }
    }

    const goToBuildOrder = () => {
        navigation.navigate("BuildOrder", {productData: data})

    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <View style={[commonStyles.rowSpaceBetween]}>
                    <SecondaryHeader title={"Browse Menu"}/>
                    <TouchableOpacity onPress={goToBuildOrder} style={styles.listDiv}>
                        <MaterialCommunityIcons name="table" size={22} color={colors.red}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{marginTop: 16}} onPress={goToBuildOrder}>
                    <TextInput
                        value={""}
                        editable={false}
                        placeholder={"Search products, companies, brands..."}
                        onChangeText={(text) => {
                        }}
                        style={commonStyles.textInput}>
                    </TextInput>
                </TouchableOpacity>
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
    },
    listDiv: {
        marginTop: 10,
        padding: 2,
        borderWidth: 1,
        borderColor: colors.red,
        borderRadius: 5
    }
});

export default connect(mapStateToProps, {})(BrandList);
