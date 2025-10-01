import { Request, Response } from 'express';
import { Controller, Get, UseBefore, Req, Res } from 'routing-controllers';
import AbstractController from './abstract.controller';
import refreshTokens from '@/middlewares/refreshToken.middleware';


@Controller('/invoices')
@UseBefore(refreshTokens)
export class AccountsController extends AbstractController {

    constructor() {
        super();
    }

    @Get('/')
    async getAllCustomers(@Req() _req: Request, @Res() _res: Response) {
        return { data: "okay", message: "Success"}
    }
}

export default AccountsController;
