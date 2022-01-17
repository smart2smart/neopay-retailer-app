const header = {
    'Content-Type': 'application/x-www-form-urlencoded',
}

const formHeader = {

}



// const base_url = 'http://192.168.1.5:8000';
//const base_url = 'http://qa-api.neopay.club';
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
    }
}

export const commonApi = {
    getRetailerDetails:{
        url:`${base_url}/retailers/details/`,
        method: 'GET',
        header: header
    },
    getDistributorDetails: {
        url: `${base_url}/retailers/distributors/`,
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
        url: `${base_url}/retailers/image/`,
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
        url: `${base_url}/salesmen/products/`,
        method: 'GET',
        header: header
    },
    getBanners: {
        url: `${base_url}/banners/`,
        method: 'GET',
        header: header
    },
}

