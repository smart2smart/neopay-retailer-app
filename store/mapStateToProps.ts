const mapStateToProps = (state: any) => {
    return {
        isLoggedIn: state.isLoggedIn,
        tokens: state.tokens,
        retailerDetails: state.retailerDetails,
        cart: state.cart,
        landingScreen: state.landingScreen
    };
};

export default mapStateToProps;