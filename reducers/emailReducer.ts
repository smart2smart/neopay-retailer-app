const userTypeReducer = (state = "", action: any) => {
  switch (action.type) {
    case "USER_TYPE": {
      return action.payload;
    }
    default:
      return state;
  }
};
export default userTypeReducer;

