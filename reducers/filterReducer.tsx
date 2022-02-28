import {
    COMPANY_FILTER_ADD,
    COMPANY_FILTER_REMOVE,
    BRAND_FILTER_ADD,
    BRAND_FILTER_REMOVE,
    PRODUCT_GROUP_FILTER_ADD,
    PRODUCT_GROUP_FILTER_REMOVE,
    RESET_FILTERS, SELECT_FILTER_TYPE, MARGIN_FILTERS
} from "../actions/actionTypes";

const data = {
    companies:[],
    brands:[],
    productGroups:[],
    count:0,
    selectedFilter:"company",
    filterOptions: [
        {name: "Company", key: 'company'},
        {name: "Brand", key: 'brand'},
        {name: "Product", key: 'product'},
    ],
    margin : {
        from:0,
        to:100
    }
}

const getCount = (type, entity, state)=>{
    let length = state.count;
    if(state[entity].length==0){
        type == "add"? length+=1:length-=1;
    }
    return length;
}

const filterReducer = (state = {...data}, action: any) => {
    switch (action.type) {
        case SELECT_FILTER_TYPE:
            return {...state, selectedFilter:action.payload}
        case COMPANY_FILTER_ADD:
            return {...state,
                companies:[...state.companies, action.payload],
                count: getCount("add", "companies", state),
                selectedFilter:"company"}
        case COMPANY_FILTER_REMOVE:
            return {...state,
                companies: state.companies.filter((item)=>item!=action.payload),
                count: getCount("remove", "companies", state),
                selectedFilter:"company"}
        case BRAND_FILTER_ADD:
            return {...state,
                brands:[...state.brands, action.payload],
                count: getCount("add", "brands", state),
                selectedFilter:"brand"}
        case BRAND_FILTER_REMOVE:
            return {...state,
                brands: state.brands.filter((item)=>item!=action.payload),
                count: getCount("remove", "brands", state),
                selectedFilter:"brand"}
        case PRODUCT_GROUP_FILTER_ADD:
            return {...state,
                productGroups:[...state.productGroups, action.payload],
                count: getCount("add", "productGroups", state),
                selectedFilter:"product"}
        case PRODUCT_GROUP_FILTER_REMOVE:
            return {...state,
                productGroups: state.productGroups.filter((item)=>item!=action.payload),
                count: getCount("remove", "productGroups", state),
                selectedFilter:"product"}
        case RESET_FILTERS:
            return {...state, ...data}
        case MARGIN_FILTERS:
            return {...state,margin:action.payload}
        default:
            return state
    }
}

export default filterReducer;