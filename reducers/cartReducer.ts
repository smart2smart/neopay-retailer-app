import PersistenceStore from "@utils/PersistenceStore";

const cart = {};

function setCartToStorage(state) {
  PersistenceStore.setCartInDraft(JSON.stringify(state));
}

const cartInDraftReducer = (state = { ...cart }, action: any) => {
  // @ts-ignore
  switch (action.type) {
    case "SET_CART_DRAFT":
      setCartToStorage(action.payload);
      return action.payload;
    case "REMOVE_RETAILER_CART_NEW":
      return {};
    case "CLEAR_CART_DRAFT":
      PersistenceStore.removeCart();
      return {};
    default:
      return state;
  }
};

export default cartInDraftReducer;
