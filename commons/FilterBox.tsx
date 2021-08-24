import commonStyles from "../styles/commonStyles";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {AntDesign, Ionicons, MaterialIcons} from "@expo/vector-icons";
import colors from "../assets/colors/colors";
import texts from "../styles/texts";
import React, {useEffect, useState} from "react";
import FilterModal from "./FilterModal";
import moment from "moment";
import {connect, useSelector, useDispatch} from "react-redux";
import mapStateToProps from "../store/mapStateToProps";
import {
    brandFilterAdd,
    brandFilterRemove,
    companyFilterAdd,
    companyFilterRemove,
    productGroupFilterAdd, productGroupFilterRemove, selectFilterType
} from "../actions/actions";


function FilterBox(props) {
    const filters = useSelector((state: any) => state.filters);
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);

    const selectFilter = (key) => {
        dispatch({type: "SELECT_FILTER_TYPE", payload: key});
    }

    const toggleEntity = (item, type) => {
        if(type==="company"){
            item.selected?props.companyFilterRemove(item.id):props.companyFilterAdd(item.id);
        }else if(type==="brand"){
            item.selected?props.brandFilterRemove(item.id):props.brandFilterAdd(item.id);
        }else if(type==="product"){
            item.selected?props.productGroupFilterRemove(item.id):props.productGroupFilterAdd(item.id);
        }
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const resetFilters = () => {
        dispatch({
            type: props.type === "report" ? "RESET_REPORTS_FILTERS" : "RESET_ORDERS_FILTERS",
            payload: undefined
        });
        props.getOrderData({});
        // getSalesmanTeam([]);
    }

    const applyFilters = ()=>{
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
        console.log(filters)
        setModalVisible(false);
        props.applyFilters(filters)
    }

    return (
        <View>
            <TouchableOpacity onPress={() => {
                setModalVisible(prevState => !prevState);
            }} style={commonStyles.orangeContainer}>
                <Ionicons name="funnel-outline" size={24} color={colors.primaryThemeColor}/>
                <Text style={texts.primaryTextBold14}>
                    Filter
                </Text>
                <View style={styles.selectedFiltersDiv}>
                    <Text style={texts.whiteTextBold12}>
                        {filters.count}
                    </Text>
                </View>
                {filters.count != 0 ?
                    <TouchableOpacity onPress={resetFilters}>
                        <AntDesign name="closecircleo" size={22} color={colors.primaryThemeColor}/>
                    </TouchableOpacity> :
                    <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.primaryThemeColor}/>}
            </TouchableOpacity>
            {modalVisible ? <FilterModal
                resetFilters={resetFilters}
                type={props.type}
                filterOptions={props.filterOptions}
                toggleEntity={toggleEntity}
                selectFilter={selectFilter}
                applyFilters={applyFilters}
                modalVisible={modalVisible}
                filters={filters}
                closeModal={closeModal}/> : null}
        </View>
    )
}

export default connect(mapStateToProps, {
    companyFilterAdd,
    companyFilterRemove,
    brandFilterAdd,
    brandFilterRemove,
    productGroupFilterAdd,
    productGroupFilterRemove,
    selectFilterType
})(FilterBox);

const styles = StyleSheet.create({
    selectedFiltersDiv: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 4,
        marginHorizontal: 8,
        backgroundColor: colors.primaryThemeColor
    }
});