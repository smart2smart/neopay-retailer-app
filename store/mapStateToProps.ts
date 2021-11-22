const mapStateToProps = (state: any) => {
    return {
        isLoggedIn: state.isLoggedIn,
        tokens: state.tokens,
        retailerDetails: state.retailerDetails,
        cart: state.cart,
        landingScreen: state.landingScreen,
        verificationStatus:state.verificationStatus,
        filters:state.filters,
        distributor:state.distributor
    };
};

export default mapStateToProps;