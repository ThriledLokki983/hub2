import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';



const goHomeMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
        res.redirect('/api');
        next();
    } catch (error) {
        next(new HttpException(401, 'Authentication failed'));
    }
};

export default goHomeMiddleware;
