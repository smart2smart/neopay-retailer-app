
const mapStateToProps = (state: any) => {
    return {
        isLoggedIn: state.isLoggedIn,
        tokens:state.tokens,
    };
};

export default mapStateToProps;