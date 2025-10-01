import { Controller, Get, UseBefore } from 'routing-controllers';
import { protect } from '@middlewares/auth.middleware';

@Controller()
export class ProductsController {

    @Get('/products')
    @UseBefore(protect)
    index() {
        return {data: 'OK', message: 'Products'};
    }
}
