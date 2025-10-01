import { Response } from 'express';
import axios, {isCancel} from 'axios';
import qs from 'qs';
import { sign } from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import {
    isEmpty,
    calculateNewExpiryDate,
    writeDataToFile,
    isAccessTokenExpired,
    readDataFromFile,
} from '@/utils/util';
import crypto from 'crypto';
import { User } from '@interfaces/users.interface';
import {
    RequestWithUser,
    DataStoredInToken,
    TokenData,
    RefreshTokenData,
    TokenBodyData,
    TokenOptions,
} from '@/interfaces/auth.interface';

import {
    REDIRECT_URI,
    GRANT_TYPE,
    CLIENT_ID,
    CLIENT_SECRET,
    SECRET_KEY,
    API_REFRESH_TOKEN_URL,
} from '@/config/config';

class AuthService {
    public async login(request: RequestWithUser): Promise<{ cookie: string, _uniqueUser: string }> {

        if (isEmpty(request)) throw new HttpException(400, "Request object is empty");

        const _uniqueUser = crypto.randomBytes(16).toString('hex');
        const tokenData = this.createToken(_uniqueUser);
        const cookie = this.createCookie(tokenData);


        return { cookie, _uniqueUser };
    }

    public async logout(request: RequestWithUser, res: Response): Promise<{_uniqueUser: User }> {
        if (isEmpty(request)) throw new HttpException(400, "Request object is empty");

        res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
        const _uniqueUser = request.user

        return { _uniqueUser };
    }

    public async getRefreshToken(tokenData: RefreshTokenData, request: RequestWithUser): Promise<{data: { refreshed: boolean }}>  {
        const { code } = tokenData;

        if (isEmpty(code)) return { data: { refreshed: false} };

        const codeDecoded = code && decodeURI(code);
        request.user = {sessionId: codeDecoded};

        const options = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
        }

        const body: TokenBodyData = {
            code: codeDecoded,
            redirect_uri: REDIRECT_URI,
            grant_type: GRANT_TYPE,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        };

        const _body = qs.stringify(body);

        const data = await this.axiosPostRequest(API_REFRESH_TOKEN_URL, _body, options);
        const { data: _data } = data;

        const { newExpireTime } = calculateNewExpiryDate(_data);
        _data.expires = newExpireTime;
        try {
            writeDataToFile('refresh_tokens.json', _data);

            return { data: { refreshed: true } };

        } catch {
            throw new HttpException(500, "Could not write to file");
        }
    }

    public  refreshTokens = async (): Promise<{data: { refreshed: boolean }}> => {
        const data = await readDataFromFile();
        if (!data) throw new HttpException(401, 'Could not refresh token - please login again');

        const { refresh_token } = data;
        const { isNotExpired, isExpired } = data && isAccessTokenExpired(data);

        if (isNotExpired) return { data: { refreshed: false } };;

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

            const data = await this.axiosPostRequest(API_REFRESH_TOKEN_URL, _body, options);
            const { data: _data } = data;

            const { newExpireTime } = calculateNewExpiryDate(_data);
            _data.expires = newExpireTime;

            try {
                writeDataToFile('refresh_tokens.json', _data);

                // return { data: { refreshed: true } };

            } catch {
                throw new HttpException(500, "Could not write to file");
            }
        }
    };

    public createToken(userId: string): TokenData {
        const dataStoredInToken: DataStoredInToken = { id: userId };
        const expiresIn: string = '1h'

        return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
    }

    public createCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; SameSite=None; Secure`;
    }

    public async axiosPostRequest(url: string, body: string, options: TokenOptions) {
        try {
           return await axios.post(url, body, options);

        } catch (error) {
            isCancel(error.message);
            throw new Error(error);
        }
    }

}

export default AuthService;
