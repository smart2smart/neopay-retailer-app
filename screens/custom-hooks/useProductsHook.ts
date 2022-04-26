import React, { useEffect, useState } from 'react';
import {
    cartChangeQuantity,
    changeLotSize,
    removeFromCart,
    updateCartAdd,
    updateCartSubtract,
    clearCart
} from "../../actions/actions";
import {useDispatch, useSelector} from "react-redux";
import {Alert} from "react-native";
import PersistenceStore from "../../utils/PersistenceStore";


const useProductsHook = (screenType, data) => {


    const distributor = useSelector((state: any) => state.distributor);
    const dispatch = useDispatch();
    const retailerData = useSelector((state: any) => state.retailerDetails);
    const [productsData, setProductsData] = useState(data);
    const [originalProductsData, setOriginalProductsData] = useState(data);
    const [normalView, setNormalView] = useState(true);
    const cart = useSelector((state: any) => state.cart);


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
        let payload = {distributorId: distributor.id};
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

    const setProductQuantity = (data, text, mainIndex, subIndex) => {
        let payload = {retailerId: retailerData.id, distributorId: distributor.id}
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

    const selectProduct = (data, type, mainIndex, subIndex) => {
        let payload = {retailerId: retailerData.id, distributorId: distributor.id}
        let allProducts = [...productsData];
        let entity = allProducts[mainIndex]["data"][subIndex];
        if (type === "new") {
            allProducts[mainIndex]["data"][subIndex]["quantity"] = 1;
            let {current_rate} = get_current_rate(entity, 1, entity["lot_quantity"]);
            entity["current_rate"] = current_rate
            payload["product"] = entity;
            dispatch(updateCartAdd(payload))
        } else if (type == "add") {
            data["quantity"] = data["quantity"]==""?1:parseInt(data["quantity"]) + 1;
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


    const selectProductAlert = (data, type, mainIndex, subIndex) => {
        if (cart.distributorId && cart.distributorId !== distributor.id) {
            Alert.alert(
                "Change Distributor",
                `You have items in your cart from another distributor. Adding new distributor will clear your cart. Are you sure you want to continue?`,
                [
                    {
                        text: "Yes",
                        onPress: () => {
                            dispatch(clearCart());
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


    return {
        productsData,
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
    }

}

export default useProductsHook;
