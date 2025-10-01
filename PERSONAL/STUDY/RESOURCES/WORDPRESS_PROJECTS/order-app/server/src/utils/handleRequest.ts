import axios, {isCancel, AxiosError} from 'axios';
import fetch from 'node-fetch';


const nativeRequest = async (url: string, method: string, data: any) => {
    try {
        const response: any = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.status !== 200) {
            throw new Error('Something went wrong');
        }
        return response.json();

    } catch (error) {
        throw new Error(error);
    }
};


const axiosGetRequest = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        isCancel(error.message);
    }
};


const axiosPutRequest = async (url: string, data: any) => {
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (error) {
        isCancel(error.message);
    }
}


export default {
    axiosGetRequest,
    axiosPutRequest,
    nativeRequest,
};
