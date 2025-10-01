import { Response } from 'express';
import { Controller, Req, Res, Get, UseBefore, Post, Body, Redirect } from 'routing-controllers';
import authMiddleware, { checkAuth } from '@middlewares/auth.middleware';
import AuthService from '@services/auth.service';
import { HttpException } from '@exceptions/HttpException';
import {
    RequestWithUser,
    RefreshTokenData,
} from '@/interfaces/auth.interface';
import { REDIRECT_URI } from '@/config/config';

@Controller()
export class AuthController {
    public authService = new AuthService();

    @Get('/login')
    @UseBefore(checkAuth)
    async login(@Req() _req: RequestWithUser, @Res() _res: Response) {
        const { _uniqueUser } = await this.authService.login(_req);

        return { sessionId: _uniqueUser, isAuthenticated: true, message: 'Login successful' };
    }

    @Post('/refreshToken')
    @UseBefore(checkAuth)
    async refreshToken(@Body() tokenData: RefreshTokenData, @Req() _req: RequestWithUser, @Res() _res: Response) {
        const {  data: { refreshed } } = await this.authService.getRefreshToken(tokenData, _req);

        if (!refreshed) {
            throw new HttpException(401, 'Could not refresh token - please login again');
        }

        return { refreshed };
    }

    @Get('/logout')
    @UseBefore(authMiddleware)
    async logout(@Req() _req: RequestWithUser, @Res() _res: Response) {
        const { _uniqueUser } = await this.authService.logout(_req, _res);

        return { sessionId: _uniqueUser, message: 'Logout successful' };
    }
}

export default AuthController;
