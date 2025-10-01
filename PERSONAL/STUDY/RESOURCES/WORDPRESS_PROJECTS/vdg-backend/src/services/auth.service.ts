import { Response } from 'express';
import { SECRET_KEY } from '@/config/config';
import { sign } from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@/utils/util';
import crypto from 'crypto';
import { User } from '@interfaces/users.interface';
import {
    RequestWithUser,
    DataStoredInToken,
    TokenData
} from '@/interfaces/auth.interface';

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

    public async refreshTokens() {
    // TODO: Implement refresh tokens logic
        return {
            status: 200,
            message: 'Refresh tokens successful',
        };
    }

    public createToken(userId: string): TokenData {
        const dataStoredInToken: DataStoredInToken = { id: userId };
        const expiresIn: number = Math.floor(Date.now() / 1000) + (60 * 12); // 12 hours

        return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
    }

    public createCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; SameSite=None;`;
    }

}

export default AuthService;
