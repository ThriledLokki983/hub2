import { Product } from './products.interface';

export interface ResponseData {
    data: Product[];
}

export interface AxiosResponseData {
    data: {
        d: {
            results: any[];
            __next?: string;
        }
    }
}

export interface ServiceResponseData {
    data: any
    length: number;
}
