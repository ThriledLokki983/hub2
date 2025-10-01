import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { Session } from "@interfaces/session.interface"
import crypto from 'crypto'

// TODO: Rename this file to RefreshTokenMiddleware.ts and implement the logic here

@Middleware({ type: 'before' })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
    use(request: Request, response: Response, next: NextFunction): void {
        let _session = request.session as any;
        const _sessionId = _session.user?.sessionId

        if(!_sessionId) {
            const sessionId = crypto.randomUUID();
            _session.user = { sessionId };

            response.set('Set-Cookie', 'SESSION_ID=' + sessionId);
            response.send("OKAY")
            next();
        }

        console.log('==================+==================');

        next();
    }
}

export default LoggingMiddleware;
