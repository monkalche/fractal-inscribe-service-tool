import axios from "axios";
import {NetworkType} from "../types";

let apiKey = localStorage.getItem('apiKey') || '27ed756be852c3458a57bb4ac5d5e5eba0b6d296585c946c2f67c404bb466cfe';
let network = NetworkType.livenet;

export function setApiNetwork(type: NetworkType) {
    network = type;
}


export function setApiKey(key: string) {
    apiKey = key;
}

function createApi(baseURL: string) {
    const api = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    })

    api.interceptors.request.use((config) => {
        if (!apiKey) {
            throw new Error("input apiKey and reload page");
        }
        config.headers.Authorization = `Bearer ${apiKey}`;
        return config;
    });
    return api;
}

const mainnetApi = createApi("https://open-api-fractal.unisat.io");
const testnetApi = createApi("https://open-api-fractal-testnet.unisat.io");

function getApi() {
    return network===NetworkType.testnet ? testnetApi : mainnetApi;
}


export const get = async (url: string, params?: any) => {
    const res = await getApi().get(url, {params});
    if (res.status !== 200) {
        throw new Error(res.statusText);
    }

    const responseData = res.data;

    if (responseData.code !== 0) {
        throw new Error(responseData.msg);
    }
    return responseData.data;
};

export const post = async (url: string, data?: any) => {
    const res = await getApi().post(url, data,);
    if (res.status !== 200) {
        throw new Error(res.statusText);
    }

    const responseData = res.data;

    if (responseData.code !== 0) {
        throw new Error(responseData.msg);
    }

    return responseData.data;
}