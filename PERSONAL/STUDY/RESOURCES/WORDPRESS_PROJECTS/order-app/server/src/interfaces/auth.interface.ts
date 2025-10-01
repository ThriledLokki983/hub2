import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
    id: number | string;
}

export interface TokenData {
    token: string;
    expiresIn: number | string;
}

export interface RefreshTokenData {
    code: string;
}
export interface RefreshTokenReturnData {
    data: any
}

export interface TokenOptions {
    headers: {
        'Content-Type': string,
        'Access-Control-Allow-Origin'?: string,
    }
}

export interface ExactOnlineTokenResponse {
    data: {
      d: any
    }
    status: number
  }

export interface TokenBodyData {
    code: string,
    redirect_uri: string,
    grant_type: string,
    client_id: string,
    client_secret: string,
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

export interface VerificationInterface {
    id: string,
    exp: number,
    iat: number,
}


export interface RequestWithUser extends Request {
    cookie: SessionCookie;
    user: User;
}



export interface TokenResponseData {
    access_token: string
    expires_in: number
    refresh_token: string
    token_type: string
    expires: string
}
