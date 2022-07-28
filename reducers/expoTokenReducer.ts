const expoTokenReducer = (state = false, action: any) => {
    switch (action.type) {
      case "EXPO_TOKENS": {
        return action.payload;
      }
      default:
        return state;
    }
  };
  export default expoTokenReducer;