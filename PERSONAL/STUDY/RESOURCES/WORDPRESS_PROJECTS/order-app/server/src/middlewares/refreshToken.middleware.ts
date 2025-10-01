import qs from 'qs';
import fs from 'fs';
import moment from 'moment';
import axios, { AxiosError, isCancel } from 'axios';
import { Response, NextFunction } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser, TokenOptions, TokenResponseData } from '@interfaces/auth.interface';
import { API_REFRESH_TOKEN_URL, CLIENT_ID, CLIENT_SECRET, } from '@/config/config';
import {
    readDataFromFile,
    isAccessTokenExpired,
    writeDataToFile,
} from '@/utils/util';


const refreshTokens = async (_req: RequestWithUser, _res: Response, next: NextFunction) => {
    const data = await readDataFromFile();

    if (!data) throw new HttpException(401, 'Could not refresh token - please login again');

    const { refresh_token, expires } = data;

    const { isNotExpired, isExpired } = isAccessTokenExpired(expires);

    if (isNotExpired) {
        next();
    };

    if (isExpired) {

        const options = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        const body = {
            refresh_token: `${refresh_token}`,
            grant_type: "refresh_token",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }

        const _body = qs.stringify(body);

        try {
            const data = await axiosPostRequest(API_REFRESH_TOKEN_URL, _body, options);
            const { data: _data } = data;


            console.log('refreshed token');


            const { newExpireTime } = calculateNewExpiryDate(_data);
            _data.expires = newExpireTime;

            writeDataToFile('refresh_tokens.json', _data);
            next();
        } catch {
            throw new HttpException(500, "Could not write to file");
        }
    }
};

async function axiosPostRequest(url: string, body: string, options: TokenOptions) {

    try {
       return await axios.post(url, body, options);

    } catch (error) {
        // isCancel(error.response.data.error);
        throw new Error(error.response.data.error);

    }
}

function calculateNewExpiryDate(data: TokenResponseData) {
    const { expires_in } = data;
    const minutesToAdd = parseInt(expires_in as any) / 60;
    const minInSeconds = minutesToAdd * 60000;
    const newExpireTime = new Date(new Date().getTime() + minInSeconds);

    return { newExpireTime };
};

export default refreshTokens;
