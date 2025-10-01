import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
    id: number | string;
}

export interface TokenData {
    token: string;
    expiresIn: number | string;
}

export interface SessionCookie {
    path: string
    _expires: Date | null
    originalMaxAge: number | string | null,
    httpOnly: boolean,
    secure: boolean,
}

export interface ExactOnlineTokenData {
    access_token: string
    expires_in: number
    refresh_token: string
    token_type: string
    expires: string
}


export interface RequestWithUser extends Request {
    cookie: SessionCookie;
    user: User;
}
