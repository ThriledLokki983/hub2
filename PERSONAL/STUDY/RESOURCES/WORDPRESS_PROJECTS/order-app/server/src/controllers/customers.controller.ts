import { Request, Response } from 'express';
import { Controller, Get, UseBefore, Req, Res, Post } from 'routing-controllers';

import { AbstractController } from './index';
import refreshTokens from '@/middlewares/refreshToken.middleware';
import { CustomerService } from '@/services';

@Controller('/customers')
@UseBefore(refreshTokens)
export class CustomersController extends AbstractController {
    public service = new CustomerService();

    constructor() {
        super();
    }

    @Get('/')
    async getAllCustomers(@Req() _req: Request, @Res() _res: Response) {
        const { data, length } = await this.service.getAllCustomers();

        return { data, length }
    }

    @Get('/:id')
    async getCustomerById(@Req() _req: Request, @Res() _res: Response) {
        return { data: "Customer by Id", message: "Success"}
    }

    @Get('/:id/accounts')
    async getCustomerByAccount(@Req() _req: Request, @Res() _res: Response) {
        return { data: "Customer by Account", message: "Success"}
    }

    @Get('/:customerName')
    async getCustomerByName(@Req() _req: Request, @Res() _res: Response) {
        return { data: "Customer by Name", message: "Success"}
    }

    @Get('/:fullName')
    async getCustomerByFullName(@Req() _req: Request, @Res() _res: Response) {
        return { data: "Customer by FullName", message: "Success"}
    }

    @Post('/')
    async createCustomer(@Req() _req: Request, @Res() _res: Response) {
        return { data: "Create CUstomer", message: "Success"}
    }

    @Post('/:id')
    async updateCustomer(@Req() _req: Request, @Res() _res: Response) {
        return { data: "Update Customer", message: "Success"}
    }
}

export default CustomersController;
