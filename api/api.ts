const header = {
    'Content-Type': 'application/x-www-form-urlencoded',
}

const formHeader = {

}

// const base_url = 'http://10.38.19.145:8000';
const base_url = 'http://qa-api.neopay.club';
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
}

export const commonApi = {

}

