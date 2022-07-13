import {
  NEW_CART,
  CLEAR_CART,
  UPDATE_CART_ADD,
  UPDATE_CART_SUBTRACT,
  REMOVE_FROM_CART,
  CART_CHANGE_QUANTITY,
  CHANGE_LOT_SIZE,
} from "../actions/actionTypes";
import PersistenceStore from "../utils/PersistenceStore";

const cart = {
  distributorId: null,
  count: 0,
  data: {},
  value: 0,
};

function setCartToStorage(state) {
  PersistenceStore.setCart(JSON.stringify(state));
}

const calculate_values = (state) => {
  let count = 0;
  let value = 0;
  Object.values(state.data).forEach((item) => {
    let quantity = item.quantity !== "" ? item.quantity : 0;
    count += parseInt(quantity);
    value +=
      parseInt(quantity) *
      parseFloat(item["current_rate"]) *
      item["lot_quantity"];
  });
  count = parseFloat(count).toFixed(2);
  value = parseFloat(value).toFixed(2);
  return { count, value };
};

const updateCart = (state, action, type) => {
  let current_state = JSON.parse(JSON.stringify(state));
  let product = action.payload.product;
  let product_id = product.id;
  if (type === "remove") {
    delete current_state.data[product_id];
  }
  current_state.data[product_id] = product;
  let { count, value } = calculate_values(current_state);
  current_state["count"] = count;
  current_state["value"] = value;
  setCartToStorage(current_state);
  return current_state;
};

const cartReducer = (state = { ...cart }, action: any) => {
  switch (action.type) {
    case NEW_CART:
      return action.payload;
    case CLEAR_CART:
      setCartToStorage({
        distributorId: null,
        count: 0,
        data: {},
        value: 0,
      });
      return {
        distributorId: null,
        count: 0,
        data: {},
        value: 0,
      };
    case UPDATE_CART_ADD:
      return updateCart(state, action, "add");
    case UPDATE_CART_SUBTRACT:
      return updateCart(state, action, "subtract");
    case REMOVE_FROM_CART:
      return updateCart(state, action, "remove");
    case CART_CHANGE_QUANTITY:
      return updateCart(state, action, "change");
    case CHANGE_LOT_SIZE:
      return updateCart(state, action, "change_unit");
    default:
      return state;
  }
};

export default cartReducer;
