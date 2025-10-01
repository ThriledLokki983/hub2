import connectRedis from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import crypto from "crypto";
import moment from "moment";
import {
    RequestWithUser
} from "@/interfaces/auth.interface";

import {
    Session,
    RequestedDataInterface,
    isSessionExpiredInterface
} from '@interfaces/session.interface';
import { Response } from "express";

export const RedisStore = connectRedis(session)
export const redisClient = createClient();
export type RedisClientType = ReturnType<typeof createClient> | any;


export const isSessionExpired = (req: RequestWithUser): isSessionExpiredInterface => {
    const { user } = requestData(req);
    const now = moment();
    const sessionDate = moment(req.session.cookie.expires);
    const isNotExpired = moment(now).isSameOrBefore(sessionDate);

    return { user, isNotExpired }
}

function requestData(req: RequestWithUser): RequestedDataInterface {
    if (!req.session) return { user: null, session: null, body: null };

    const { session, body } = req;
    const { user } = session as unknown as Session;

    return { user, session, body };
}


export const  verifySession = async(req: RequestWithUser): Promise<Boolean> => {

   try {
        // if( !req.session ) return false;
        const { session } = requestData(req);

        console.log({ session });


        const { cookie } = req.headers;
        const _sessionCookie = cookie?.split('=')?.[1]?.trim();
        if((!_sessionCookie && !session) || !session) return false;

        const _sessionData = await redisClient.get(_sessionCookie);
        if(_sessionData) return true;
        if(!_sessionData) return false;

        const { user: { sessionId } } = requestData(req);
        if( !sessionId ) return false;

        const sessionData = await redisClient.get(sessionId);
        if( !sessionData ) return false;

        return true
   } catch (error) {
         console.log(error);
         return false;
   }
}

export const createSession = async(req: RequestWithUser, res: Response): Promise<Boolean> => {
    const sessionId = crypto.randomUUID();

    try {
        const { session } = requestData(req);
        if( session ) return false;

        (req.session as unknown as Session) = { user: { sessionId } };
        req.user = { sessionId };
        const _user = `user-${sessionId.slice(0, 5)}`;
        await redisClient.set(sessionId, _user);
        res.set('Set-Cookie', 'SESSION_ID=' + sessionId);

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}
