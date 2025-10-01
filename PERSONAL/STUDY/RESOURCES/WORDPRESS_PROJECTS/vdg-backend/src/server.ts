import App from '@/app';
import { AuthController } from '@controllers/auth.controller';
import { ProductsController } from '@controllers/products.controller';
import { IndexController } from '@controllers/index.controller';
import SessionMiddleware from './middlewares/session.middleware';

import validateEnv from '@/utils/validateEnv';

validateEnv();

const app = new App(
    [
        AuthController,
        IndexController,
        ProductsController
    ],
    []
);

app.listen();
