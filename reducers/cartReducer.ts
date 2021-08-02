import {
    NEW_CART,
    CLEAR_CART,
    ADD_TO_CART,
    UPDATE_CART_ADD,
    UPDATE_CART_SUBTRACT,
    CART_CHANGE_QUANTITY
} from "../actions/actionTypes";


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
            return {...cart}
        case ADD_TO_CART: {
            let product = action.payload["product"]
            product["quantity"] = 1;
            let new_state = JSON.parse(JSON.stringify(state));
            new_state["distributorId"] = action.payload["distributorId"];
            let available = false;
            new_state.data.forEach((item) => {
                if (item["product_group_id"] === product["product_group_id"]) {
                    available = true;
                    item.data.push(product)
                }
            });
            if(!available) {
                let item = {
                    company_name: product["company_name"], brand_name: product["brand_name"],
                    image: product["product_group_image"], product_group: product["product_group"],
                    product_group_id: product["product_group_id"], data: [product]
                }
                new_state.data.push(item)
            }
            new_state["count"] += 1;
            new_state["value"] += parseFloat(product["rate"]);
            return new_state;
        }
        case UPDATE_CART_ADD:
            let new_state = JSON.parse(JSON.stringify(state))
            let product = action.payload["product"]
            new_state.data.forEach((item) => {
                if (item["product_group_id"] === product["product_group_id"]) {
                    item.data.forEach((itm) => {
                        if (product["id"] == itm["id"]) {
                            itm.quantity += 1
                        }
                    })
                }
            });
            new_state["count"] += 1;
            new_state["value"] += parseFloat(product["rate"]);
            new_state["distributorId"] = action.payload["distributorId"]
            return new_state
        case UPDATE_CART_SUBTRACT:
            let state_new = JSON.parse(JSON.stringify(state))
            let product_new = action.payload["product"]
            state_new.data.forEach((item) => {
                if (item["product_group_id"] === product_new["product_group_id"]) {
                    item.data.forEach((itm) => {
                        if (product_new["id"] == itm["id"]) {
                            if (itm.quantity > 0) {
                                itm.quantity -= 1
                            }
                        }
                    })
                }
            });
            state_new["count"] -= 1;
            state_new["value"] -= parseFloat(product_new["rate"]);
            state_new["distributorId"] = action.payload["distributorId"];
            return state_new
        case CART_CHANGE_QUANTITY:
            let state_change = JSON.parse(JSON.stringify(state))
            let product_change = action.payload["product"]
            let text = action.payload.text;
            let currentQuantity = 0;
            state_change.data.forEach((item) => {
                if (item["product_group_id"] === product_change["product_group_id"]) {
                    item.data.forEach((itm) => {
                        if (product_change["id"] == itm["id"]) {
                            console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
                            console.log(itm)
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
            return state_change
        default:
            return state
    }
}

export default cartReducer;