import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import AuthService from '@services/auth.service';
import {
    DataStoredInToken,
    RequestWithUser,
    VerificationInterface
} from '@interfaces/auth.interface';
import {
    SECRET_KEY,
    API_BASE_AUTH,
} from '@/config/config';

const authService = new AuthService();

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

        if (Authorization) {
            const secretKey: string = SECRET_KEY;
            const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
            const userId = verificationResponse.id as string;

            if (userId) {
                req.user = { sessionId: userId }
                next();
            } else {
                next(new HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new HttpException(404, 'Authentication token missing'));
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication'));
    }
};

export const checkAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

        if (Authorization) {
            const secretKey: string = SECRET_KEY;
            const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
            const { id: userId, exp: expiresIn, iat: issuedAt } = verificationResponse as VerificationInterface;

            if (!userId) {
                throw new HttpException(401, 'Wrong authentication token');
            }

            next();
        } else {
            const { cookie } = await authService.login(req);
            res.setHeader('Set-Cookie', [cookie]);

            res.status(200).json({
                authUrl: API_BASE_AUTH,
                isAuthenticated: false,
            })
            // next();
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication'));
    }
};

export const protect = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

        if (Authorization) {
            const secretKey: string = SECRET_KEY;
            const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
            const userId = verificationResponse.id as string;

            if (userId) {
                next();
            }

        } else {

            res.status(301).redirect(API_BASE_AUTH);
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication'));
    }
}


export default authMiddleware;
