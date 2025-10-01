import { Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Controller, Req, Res, Get, UseBefore, UseAfter } from 'routing-controllers';
import authMiddleware, { checkAuth } from '@middlewares/auth.middleware';
import AuthService from '@services/auth.service';

@Controller()
export class AuthController {
    public authService = new AuthService();

    @Get('/login')
    @UseBefore(checkAuth)
    async login(@Req() _req: RequestWithUser, @Res() _res: Response) {
        const { _uniqueUser } = await this.authService.login(_req);

        return { sessionId: _uniqueUser, message: 'Login successful' };
    }

    @Get('/logout')
    @UseBefore(authMiddleware)
    async logout(@Req() _req: RequestWithUser, @Res() _res: Response) {
        const { _uniqueUser } = await this.authService.logout(_req, _res);

        return { sessionId: _uniqueUser, message: 'Logout successful' };
    }
}
