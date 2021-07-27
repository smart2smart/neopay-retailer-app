import {CART, NEW_CART, CLEAR_CART, ADD_TO_CART, UPDATE_CART_ADD, UPDATE_CART_SUBTRACT} from "../actions/actionTypes";


const cart = {
    distributor: null,
    data: []
}

const cartReducer = (state = {...cart}, action: any) => {
    switch (action.type) {
        case NEW_CART:
            return action.payload
        case CLEAR_CART:
            return {...cart}
        case ADD_TO_CART: {
            let product = action.payload
            product["quantity"] = 1;
            let new_state = {...state}
            new_state.data.push(product)
            return new_state;
        }
        case UPDATE_CART_ADD:
            let new_state = {...state}
            let product = {...action.paylload}
            new_state.data.forEach((item) => {
                if (item.id === product.id) {
                    item.qunatity += 1
                }
            })
            return new_state
        case UPDATE_CART_SUBTRACT:
            let state_new = {...state}
            let product1 = {...action.paylload}
            state_new.data.forEach((item) => {
                if (item.id === product1.id) {
                    item.qunatity += 1
                }
            })
            return state_new
        default:
            return state
    }
}

export default cartReducer;