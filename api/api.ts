const header = {
    'Content-Type': 'application/x-www-form-urlencoded',
}

const formHeader = {

}

// const base_url = 'http://10.38.21.231:8000';
// const base_url = 'http://qa-api.neopay.club';
const base_url = 'https://api.neopay.club';


export const authApi = {
    mobileLogin: {
        header: header,
        url: `${base_url}/retailers/register/`,
        method: 'POST',
    },
    refresh: {
        url: `${base_url}/api/token/refresh/`,
        method: 'POST',
        header: header
    },
    otp: {
        url: `${base_url}/retailers/otp/`,
        method: 'POST',
        header: header
    },
    emailLogin: {
        header: header,
        url: `${base_url}/api/token/`,
        method: "POST",
      },
    getUserType: {
        header: header,
        url: `${base_url}/users/me/`,
        method: "GET",
      },
}

export const commonApi = {
    getDistributorDetails:{
        url:`${base_url}/distributor/details/`,
        method: 'GET',
        header: header
    },
    getRetailerDetails:{
        url:`${base_url}/retailers/details/`,
        method: 'GET',
        header: header
    },
    getDistributorProducts: {
        url: `${base_url}/retailers/distributor-products/`,
        method: 'GET',
        header: header
    },
    getPinCodeList: {
        url: `${base_url}/localities/pincode/`,
        method: 'GET',
        header: header
    },
    getLocalities:{
        header: header,
        url: `${base_url}/localities/locality/`,
        method: 'GET',
    },
    getCities:{
        header: header,
        url: `${base_url}/localities/city/`,
        method: 'GET',
    },
    updateRetailerImage: {
        url: `${base_url}/retailers/`,
        method: 'PATCH',
        header: formHeader
    },
    updateProducts: {
        url: `${base_url}/products/`,
        method: 'GET',
        header: header
    },
    updateRetailerProfile:{
        header: header,
        url: `${base_url}/retailers/`,
        method: 'PATCH',
    },
    placeOrder:{
        header: header,
        url: `${base_url}/orders/`,
        method: 'POST',
    },
    getOrderList:{
        header: header,
        url: `${base_url}/orders/`,
        method: 'GET',
    },
    getInvoiceList: {
        url: `${base_url}/invoices/`,
        method: 'GET',
        header: header
    },
    getDiscountAmount:{
        url: `${base_url}/orders/calculate-discount/`,
        method: 'GET',
        header: header
    },
    getProducts: {
        url: `${base_url}/products/`,
        method: 'GET',
        header: header
    },
    getBanners: {
        url: `${base_url}/banners/`,
        method: 'GET',
        header: header
    },
    getBeatPlanList: {
        url: `${base_url}/beats/`,
        method: 'GET',
        header: header
    },
    getStateList: {
        header: header,
        url: `${base_url}/localities/state/`,
        method: 'GET',
    },
    getDistrictList: {
        header: header,
        url: `${base_url}/localities/district/`,
        method: 'GET',
    },
    getCityList: {
        header: header,
        url: `${base_url}/localities/city/`,
        method: 'GET',
    },
    getRetailerMetaData: {
        url: `${base_url}/retailers/meta-data/`,
        method: 'GET',
        header: header
    },
    updateRetailer: {
        header: header,
        url: `${base_url}/retailers/`,
        method: 'PATCH',
    },
}

