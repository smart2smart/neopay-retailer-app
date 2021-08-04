import {
    NEW_CART,
    CLEAR_CART,
    ADD_TO_CART,
    UPDATE_CART_ADD,
    UPDATE_CART_SUBTRACT,
    CART_CHANGE_QUANTITY
} from "../actions/actionTypes";
import PersistenceStore from "../utils/PersistenceStore";


const cart = {
    distributorId: null,
    count: 0,
    data: [],
    value: 0
}


const cartReducer = (state = {...cart}, action: any) => {
    switch (action.type) {
        case NEW_CART:
            return action.payload
        case CLEAR_CART:
            PersistenceStore.removeCart();
            return {...cart}
        case ADD_TO_CART:
            let product_new = action.payload["product"]
            product_new["quantity"] = 1;
            let state_new = JSON.parse(JSON.stringify(state));
            state_new["distributorId"] = action.payload["distributorId"];
            let available = false;
            state_new.data.forEach((item) => {
                if (item["product_group_id"] === product_new["product_group_id"]) {
                    available = true;
                    item.data.push(product_new)
                }
            });
            if(!available) {
                let item = {
                    company_name: product_new["company_name"], brand_name: product_new["brand_name"],
                    image: product_new["product_group_image"], product_group: product_new["product_group"],
                    product_group_id: product_new["product_group_id"], data: [product_new]
                }
                state_new.data.push(item)
            }
            state_new["count"] += 1;
            state_new["value"] += parseFloat(product_new["rate"]);
            PersistenceStore.setCart(JSON.stringify(state_new));
            return state_new;
        case UPDATE_CART_ADD:
            let state_add = JSON.parse(JSON.stringify(state))
            let product_add = action.payload["product"]
            state_add.data.forEach((item) => {
                if (item["product_group_id"] === product_add["product_group_id"]) {
                    item.data.forEach((itm) => {
                        if (product_add["id"] == itm["id"]) {
                            itm.quantity += 1
                        }
                    })
                }
            });
            state_add["count"] += 1;
            state_add["value"] += parseFloat(product_add["rate"]);
            state_add["distributorId"] = action.payload["distributorId"]
            PersistenceStore.setCart(JSON.stringify(state_add));
            return state_add
        case UPDATE_CART_SUBTRACT:
            let state_subtract = JSON.parse(JSON.stringify(state))
            let product_subtract = action.payload["product"]
            state_subtract.data.forEach((item) => {
                if (item["product_group_id"] === product_subtract["product_group_id"]) {
                    item.data.forEach((itm, idx) => {
                        if (product_subtract["id"] == itm["id"]) {
                            if (itm.quantity > 0) {
                                itm.quantity -= 1
                            }
                            if(itm.quantity==0){
                                item.data.splice(idx, 1);
                            }
                        }
                    })
                }
            });
            state_subtract["count"] -= 1;
            state_subtract["value"] -= parseFloat(product_subtract["rate"]);
            state_subtract["distributorId"] = action.payload["distributorId"];
            PersistenceStore.setCart(JSON.stringify(state_subtract));
            return state_subtract
        case CART_CHANGE_QUANTITY:
            let state_change = JSON.parse(JSON.stringify(state))
            let product_change = action.payload["product"]
            let text = action.payload.text;
            let currentQuantity = 0;
            state_change.data.forEach((item) => {
                if (item["product_group_id"] === product_change["product_group_id"]) {
                    item.data.forEach((itm) => {
                        if (product_change["id"] == itm["id"]) {
                            currentQuantity = itm.quantity;
                            itm.quantity = text;
                        }
                    })
                }
            })
            if(text==""){
                state_change.count -= currentQuantity;
                state_change.value -= parseFloat(product_change["rate"])*currentQuantity;
            }else{
                state_change.count += parseInt(text)  - currentQuantity;
                state_change.value += (parseInt(text)  - currentQuantity)*product_change["rate"];
            }
            state_change["distributorId"] = action.payload["distributorId"]
            PersistenceStore.setCart(JSON.stringify(state_change));
            return state_change
        default:
            return state
    }
}

export default cartReducer;