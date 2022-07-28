const mapStateToProps = (state: any) => {
    return {
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