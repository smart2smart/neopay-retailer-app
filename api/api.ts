const header = {
    'Content-Type': 'application/x-www-form-urlencoded',
}

const formHeader = {

}

const base_url = 'http://192.168.43.253:8000';
// const base_url = 'http://qa-api.neopay.club';
//const base_url = 'https://api.neopay.club';

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
}

export const commonApi = {
    getRetailerDetails:{
        url:`${base_url}/retailers/details/`,
        method: 'GET',
        header: header
    },
    getDistributorDetails: {
        url: `${base_url}/retailers/distributors`,
        method: 'GET',
        header: header
    },
    getDistributorproducts: {
        url: `${base_url}/retailers/distributor-products/`,
        method: 'GET',
        header: header
    },
    storeDetails : {
        url: `${base_url}/retailers/profile/`,
        method: 'PATCH',
        header: header
    },
    retailerAddrerss : {
        url: `${base_url}/retailers/address/`,
        method: 'PATCH',
        header: header
    },
    getBusinessInfo : {
        url: `${base_url}/retailers/license-data/`,
        method: 'PATCH',
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
    updateRetailerImage: {
        url: `${base_url}/salesmen/retailer-image/<int:pk>/`,
        method: 'PATCH',
        header: header
    },
<<<<<<< HEAD
    getOrders:{

    }
    
=======
    updateProducts: {
        url: `${base_url}/products/`,
        method: 'GET',
        header: header
    },    
>>>>>>> d9434690a5df534b9218296ea435dff7008cf8d8
}

