import React, {Component, useEffect, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    FlatList,
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
import { BorderButtonSmallBlue, SolidButtonBlue } from '../../buttons/Buttons';
import Icon from "react-native-vector-icons/Feather";

export default function CreateOrder(props) {

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
    
    const [showSearch, setShowSearch] = useState(false);
    const [productData, setProductData] = useState(mockData);

    // console.log('Data', productData);

    const showSearchBar = () => {
        setShowSearch(true);
        if (showSearch === true) setShowSearch(false);
    };

    const productDescription = (item) => {
        return(
            <View>
                <Text>{item.distributor}</Text>
            </View>
        );
    }
    
    
    return(
        <View style={{flex: 1, paddingHorizontal: 24, backgroundColor: colors.white}}>
            <View style={commonStyles.rowSpaceBetween}>
                <SecondaryHeader title={"Create Order"}/>
                <TouchableOpacity style={{ marginTop: 24 }} onPress={() => {showSearchBar()}}>
                    <Icon name="search" size={24} color={colors.orange} />
                </TouchableOpacity>
            </View>
            {showSearch && (<View style={[commonStyles.searchContainer, { marginTop: 30 }]}>
                <TextInput
                    maxLength={10}
                    placeholder={"Search for Products"}
                    style={commonStyles.textInput}
                />
                </View>
            )}

            {/* <FlatList
                data={productData.results}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id + ""}
                renderItem={(item, index) => productDescription(item,index)}
            /> */}
            <FlatList
            data={productData.results}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.name + ""}
            renderItem={({item, index}) =>productDescription(item, index)}
          />
        </View>
    )
}