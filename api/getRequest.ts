export const GetRequest = async (payload:any) => {
    let data
    try {
        let response = await fetch(payload.url, {
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            method: payload.method,
            headers: new Headers(payload.header),
        })
        await response.json().then(json => {
            data = { status: response.status, data: json };
        });
    } catch (error) {
        data = error;
    }
    return data;
}


