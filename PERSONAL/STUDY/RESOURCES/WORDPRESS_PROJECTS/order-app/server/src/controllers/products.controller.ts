import { Response } from 'express';
import { Controller, Get, UseBefore } from 'routing-controllers';
import AbstractController from './abstract.controller';
import refreshTokens from '@/middlewares/refreshToken.middleware';

@Controller('/products')
@UseBefore(refreshTokens)
export class ProductsController extends AbstractController {

    constructor() {
        super();
    }

    @Get('/bulk')
    async getAllProducts(res: Response) {
        const { data } = await this.read('product');

        return { data };
    }
}


export default ProductsController;
