import axios, { isCancel } from 'axios';
import { HttpException } from '@/exceptions/HttpException';
import { getAccessToken } from '@utils/util';
import { GetProductOptions } from '@/interfaces/products.interface';
import { AxiosResponseData } from '@/interfaces/abstract.interface';


type OptionsType = GetProductOptions | any;


class AbstractService {
    public async getRefreshToken() {
        const token = await getAccessToken();

        return { token };
    }

    public async get(url: string): Promise<AxiosResponseData> {
        const { token } = await this.getRefreshToken();

        if (!token) {
            throw new HttpException(401, 'Could not refresh token - please login again');
        }

        const options: OptionsType = {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }

        try {

            return await axios.get(url, options);

        } catch (error) {

            isCancel(error.message);
            console.log(error.response?.data?.error);

            throw new HttpException(500, 'Could not get data');

        }

    }
}

export default AbstractService;
