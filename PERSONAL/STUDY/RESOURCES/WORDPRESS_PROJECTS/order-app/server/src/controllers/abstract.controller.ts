import { Controller, Get, Post, Put, UseBefore } from 'routing-controllers';
import ProductService from '@/services/product.service';
import { ResponseData } from '@/interfaces/abstract.interface';

@Controller()
export class AbstractController {
    public productService = new ProductService();

    @Get()
    public async read(service: "product" | "customer"): Promise<ResponseData> {

        if (service === "product") {
            const { data } = await this.productService.getProducts()

            if (!data) return { data: [] };

            const { d: { results } } = data;
            return { data: results };
        }
    }

    @Post()
    public create() {
        console.log('create');
    }

    @Put()
    public update() {
        console.log('update');
    }
}

export default AbstractController;
