import {
    NEW_CART,
    CLEAR_CART,
    UPDATE_CART_ADD,
    UPDATE_CART_SUBTRACT,
    REMOVE_FROM_CART
} from "../actions/actionTypes";
import PersistenceStore from "../utils/PersistenceStore";

const cart = {
    distributorId: null,
    count: 0,
    data: [],
    value: 0
}

function setCartToStorage(state) {
    return new Promise(resolve => {
        PersistenceStore.setCart(JSON.stringify(state));
    })
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
                data: [...state.data, action.payload.product],
                count: state.count + 1,
                value: state.value + parseInt(action.payload.product["rate"]),
                distributorId: action.payload["distributorId"]
            };
            setCartToStorage(state_add);
            return state_add;
        case UPDATE_CART_SUBTRACT:
            let state_subtract = {
                ...state,
                data: [...state.data, action.payload.product],
                count: state.count - 1,
                value: state.value - parseInt(action.payload.product["rate"]),
                distributorId: action.payload["distributorId"]
            };
            setCartToStorage(state_subtract);
            return state_subtract
        case REMOVE_FROM_CART:
            let count, value = 0;
            let data = state.data.filter((item, i) => {
                count += item.quantity;
                value += item["rate"]*item.quantity;
                return item.id !== action.payload.product.id
            })
            let remove_from_cart = {
                data:data,
                count: count,
                value: value,
                distributorId: action.payload["distributorId"]
            };
            setCartToStorage(remove_from_cart);
            return remove_from_cart

        default:
            return state
    }
}

export default cartReducer;