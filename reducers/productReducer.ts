const products = {};

const productReducer = (state = { ...products }, action: any) => {
  switch (action.type) {
    case "SET_RETAILER_PRODUCTS": {
      return {
        ...action.payload,
      };
    }
    case "UPDATE_PRODUCTS_NEW": {
      return {
        ...state,
        [action.payload.beatId]: {
          ...state[action.payload.beatId],
          category_2: action.payload.category2,
        },
      };
    }
    case "CLEAR_CART_UPDATE_COUNT": {
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          ...(state[action.payload]?.category_2 && {
            category_2: state[action.payload]?.category_2?.map((item) => {
              return { item, count: 0 };
            }),
          }),
        },
      };
    }
    default:
      return state;
  }
};

export default productReducer;
