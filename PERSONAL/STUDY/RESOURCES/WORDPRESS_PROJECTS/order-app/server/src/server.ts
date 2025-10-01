import App from '@/app';
import validateEnv from '@/utils/validateEnv';
import {
    ProductsController,
    AuthController,
    IndexController,
    CustomersController
} from "@controllers/index"


validateEnv();

const app = new App(
    [
        AuthController,
        IndexController,
        ProductsController,
        CustomersController,
    ],
    []
);

app.listen();

// k9_37XxGq\''9?NF
// info@wiersma-ict.nl
