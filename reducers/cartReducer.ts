import {
    NEW_CART,
    CLEAR_CART,
    UPDATE_CART_ADD,
    UPDATE_CART_SUBTRACT,
    REMOVE_FROM_CART, CART_CHANGE_QUANTITY
} from "../actions/actionTypes";
import PersistenceStore from "../utils/PersistenceStore";

const cart = {
    distributorId: null,
    count: 0,
    data: [],
    value: 0
}

function setCartToStorage(state) {
    PersistenceStore.setCart(JSON.stringify(state));
}

const getData = (state, product, type) => {
    let data = [...state.data]
    let available = false;
    data.forEach((item) => {
        if (item.id == product.id) {
            available = true;
            item.quantity = product.quantity
        }
    })
    if (!available || type == "add") {
        data.push(product)
    }
    return data;
}

const cartReducer = (state = {...cart}, action: any) => {
    switch (action.type) {
        case NEW_CART:
            return action.payload
        case CLEAR_CART:
            PersistenceStore.removeCart();
            return {...cart}
        case UPDATE_CART_ADD:
            let state_add = {
                ...state,
                data: getData(state, action.payload.product, "add"),
                count: state.count + 1,
                value: (parseFloat(state.value) + parseFloat(action.payload.product["rate"])).toFixed(2),
                distributorId: action.payload["distributorId"]
            };
            setCartToStorage(state_add);
            return state_add;
        case UPDATE_CART_SUBTRACT:
            let state_subtract = {
                ...state,
                data: getData(state, action.payload.product, "subtract"),
                count: state.count - 1,
                value: (parseFloat(state.value) - parseFloat(action.payload.product["rate"])).toFixed(2),
                distributorId: action.payload["distributorId"]
            };
            setCartToStorage(state_subtract);
            return state_subtract
        case REMOVE_FROM_CART:
            let remove_from_cart = {
                ...state,
                data: [...state.data.filter((item) => item.id !== action.payload.product.id)],
                count: state.count - 1,
                value: (parseFloat(state.value) - parseFloat(action.payload.product["rate"])).toFixed(),
                distributorId: action.payload["distributorId"]
            };
            setCartToStorage(remove_from_cart);
            return remove_from_cart
        case CART_CHANGE_QUANTITY:
            let item = action.payload.product;
            let change_quantity = {
                ...state,
                data: item.quantity ? getData(state, action.payload.product, "change") : [...state.data.filter((item) => item.id !== action.payload.product.id)],
                count: action.payload.text === "" ? parseInt(state.count) - action.payload.originalQuantity : parseInt(state.count) - action.payload.originalQuantity + parseInt(action.payload.text),
                value: (action.payload.text === "" ? parseFloat(state.value) - parseFloat(item["rate"] * action.payload.originalQuantity) : parseFloat(state.value) + parseFloat(item["rate"] * (parseInt(action.payload.text) - action.payload.originalQuantity))).toFixed(2),
                distributorId: action.payload["distributorId"]
            };
            setCartToStorage(change_quantity);
            return change_quantity
        default:
            return state
    }
}

export default cartReducer;