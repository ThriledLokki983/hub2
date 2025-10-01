import { Request, Response, NextFunction } from "express";
import session from "express-session";
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { SESSION_SECRET } from "@/config/config";
import {
    RedisStore,
    redisClient,
    RedisClientType,
} from '@/utils/session';


@Middleware({ type: 'before' })
export class SessionMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next: NextFunction ): void {

        next();
    }

}

export default SessionMiddleware;
