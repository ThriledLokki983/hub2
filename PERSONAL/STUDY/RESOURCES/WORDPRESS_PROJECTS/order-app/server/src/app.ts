import "reflect-metadata";
import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { useExpressServer } from 'routing-controllers';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import {
    NODE_ENV,
    PORT,
    LOG_FORMAT,
    ORIGIN,
    CREDENTIALS,
} from "./config/config";

class App {
    public app: express.Application;
    public env: string;
    public port: number | string;

    constructor(Controllers: Function[], middlewares: Function[] = []) {
        this.app = express();
        this.env = NODE_ENV || 'development';
        this.port = PORT || 8000;

        this.initializeMiddlewares();
        this.initializeRoutes(Controllers, middlewares);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
          logger.info(`=================================`);
          logger.info(`======= ENV: ${this.env} =======`);
          logger.info(`🚀 App listening on the port ${this.port}`);
          logger.info(`=================================`);
        });
    }

    private initializeMiddlewares() {
        const viewDir = path.join(__dirname, 'views');
        const staticDir = path.join(__dirname, 'public');

        this.app.use(cors({ credentials: CREDENTIALS , origin: ORIGIN }));
        this.app.use(morgan(LOG_FORMAT, { stream }));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(express.static(staticDir));
        this.app.set('views', viewDir);
      }

    private initializeRoutes(controllers: Function[], middlewares: Function[] = []) {
        useExpressServer(this.app, {
            cors: {
                origin: ORIGIN,
                credentials: CREDENTIALS,
            },
            defaults: {
                nullResultCode: 404,
                undefinedResultCode: 204,
            },
            controllers: controllers,
            middlewares: middlewares,
            defaultErrorHandler: false,
            routePrefix: '/api',
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;
