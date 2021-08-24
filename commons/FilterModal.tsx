import commonStyles from "../styles/commonStyles";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import colors from "../assets/colors/colors";
import React, {useEffect, useState} from "react";
import Icon from 'react-native-vector-icons/AntDesign';
import texts from "../styles/texts";
import {connect, useSelector} from "react-redux";
import {BorderButtonSmallRed, BorderButtonSmallBlue} from "../buttons/Buttons";
import mapStateToProps from "../store/mapStateToProps";


function FilterModal(props) {

    const filters = useSelector((state: any) => state.filters);

    const setFilters = () => {
        let data = {...props.filterOptions};
        for (let key of Object.keys(data)) {
            data[key].forEach((item) => {
                item["selected"] = filters[key].indexOf(item.id) != -1;
            })
        }
        return data;
    }

    const filterOptions = setFilters();

    useEffect(() => {

    }, [filterOptions])

    const RenderOptions = (props) => {
        return (
            <View style={{paddingLeft: 10, paddingTop: 10}}>
                <Text style={texts.greyNormal10}>Tap to select or deselect. Red-selected,
                    Blue-Not
                    selected</Text>
                <View style={style.salesmanContainer}>
                    {props.data.map((item, index) => {
                        return (
                            item.selected ? <View key={item.id} style={style.salesmanBtn}>
                                <BorderButtonSmallRed ctaFunction={() => {
                                    props.toggleEntity(item, props.type)
                                }} text={item.name}/>
                            </View> : <View key={item.id} style={style.salesmanBtn}>
                                <BorderButtonSmallBlue ctaFunction={() => {
                                    props.toggleEntity(item, props.type)
                                }} text={item.name}/>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.closeModal();
            }}
        >
            <View style={[commonStyles.modalContainer, {backgroundColor: "rgba(0,0,0,0.4)", padding: 10}]}>
                <View style={style.container}>
                    <View style={{flex: 95}}>
                        <View style={style.headerDiv}>
                            <Text style={texts.darkGrey18Bold}>
                                Filters
                            </Text>
                            <TouchableOpacity onPress={() => {
                                props.closeModal();
                            }} style={commonStyles.modalCloseIcon}>
                                <Icon name="close" size={24} color={colors.black}/>
                            </TouchableOpacity>
                        </View>
                        <View style={style.contentDiv}>
                            <View style={style.contentDivLeft}>
                                {filters.filterOptions.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => props.selectFilter(item.key)}
                                                          style={[style.filterItem, item.key == filters.selectedFilter ? style.selected : {}]}>
                                            <Text style={texts.darkGreyTextBold16}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                            <View style={style.contentDivRight}>
                                {filters.selectedFilter === 'company' ?
                                    <RenderOptions type={'company'} toggleEntity={props.toggleEntity}
                                                   data={filterOptions.companies}/> : null}
                                {filters.selectedFilter === 'brand' ?
                                    <RenderOptions type={'brand'} toggleEntity={props.toggleEntity}
                                                   data={filterOptions.brands}/> : null}
                                {filters.selectedFilter === 'product' ?
                                    <RenderOptions type={'product'} toggleEntity={props.toggleEntity}
                                                   data={filterOptions.productGroups}/> : null}
                            </View>
                        </View>
                    </View>
                    <View style={style.footer}>
                        <View style={commonStyles.rowAlignCenter}>
                            <BorderButtonSmallBlue ctaFunction={() => {
                                props.closeModal();
                                props.resetFilters();
                            }} text={"Clear All"}/>
                            <View style={{marginLeft: 10}}>
                                <BorderButtonSmallRed ctaFunction={props.applyFilters} text={"Apply"}/>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default connect(mapStateToProps, {})(FilterModal);

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 5,
        justifyContent: 'space-between'
    },
    headerDiv: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.light_grey
    },
    footer: {
        paddingTop: 10,
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: colors.light_grey,
        flex: 5,
        padding: 12,
    },
    contentDiv: {
        flex: 1,
        flexDirection: "row",
    },
    contentDivLeft: {
        flex: 0.3,
        backgroundColor: '#f8f8f8',
        borderRightWidth: 1,
        borderRightColor: colors.light_grey,
    },
    contentDivRight: {
        flex: 0.7,
    },
    filterItem: {
        paddingVertical: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        borderLeftColor: 'transparent',
        borderLeftWidth: 3,
    },
    selected: {
        borderLeftColor: colors.primary_color,
        borderLeftWidth: 3,
        backgroundColor: colors.white
    },
    salesmanContainer: {
        flexDirection: 'row',
        flexWrap: "wrap",
        paddingTop: 16
    },
    salesmanBtn: {
        marginRight: 10,
        marginBottom: 10
    }
})