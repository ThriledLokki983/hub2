import AbstractService from './abstract.service';
import { ResponseData } from '@/interfaces/products.interface';
import {
    API_DIV_URL,
    API_ITEMS_DIVISION,
    BULK_PRODUCT_FIELDS
} from '@/config/config';

class ProductService extends AbstractService {
    constructor() {
        super();
    }

    public async getProducts(): Promise<ResponseData> {
        const _url = `${API_DIV_URL}/bulk/${API_ITEMS_DIVISION}/${BULK_PRODUCT_FIELDS}`;
        const data = await this.get(_url);

        const { data: _data } = data;

        return { data: _data };
    }
}


export default ProductService;
