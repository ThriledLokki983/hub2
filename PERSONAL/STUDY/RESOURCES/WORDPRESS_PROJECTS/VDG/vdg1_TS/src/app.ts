/** @format */
import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import path from 'path'
import morgan from 'morgan'
import cors from 'cors'
// import dotenv from 'dotenv'
import * as redis from 'redis'
// import session from 'express-session'
// import connectRedis from 'connect-redis'
import logger from './utils/logger'
import { stream } from './utils/logger'
import { AppError } from './middleware/error'
import cookieParser from 'cookie-parser';
// const CREDENTIALS = process.env.CREDENTIALS === 'true'
// const ORIGIN = process.env['ORIGIN']

/************************************************************************************
 *                                        ROUTES                                    *
 ***********************************************************************************/
// import authRouter from './routes/authRouter'
import accountsRouter from './routes/accountRouter'
import customerRouter from './routes/customerRouter'
import productRouter from './routes/productRouter'
import userRouter from './routes/userRouter'
import invoiceRouter from './routes/invoiceRouter'
import warehouseRouter from './routes/warehouseRouter'
// import globalErrorController from './controllers/globalErrorController'
// dotenv.config({ path: './config-dev.env' })
process.env.NODE_ENV = process.env['ENVIRONMENT']

/************************************************************************************
 *                     Set basic express/express-session settings                   *
 ***********************************************************************************/
// const RedisStore = connectRedis(session)
const redisClient = redis.createClient({ url: process.env.REDIS_URL })

const app = express()
const corsOpts = {
  origin: 'https://05bf-88-159-226-199.eu.ngrok.io',
  credentials: true,
};

app.use(cors(corsOpts));
app.use(express.json());
app.use(cookieParser());

// app.set('trust proxy', 1) // trust first proxy
// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     name: 'SESSION_ID',
//     secret: process.env.SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 8, // 8-hours
//       httpOnly: true,
//       secure: true,
//     },
//   })
// )

app.use(function (req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any)) {
    logger.info('OOOOPPS - THERE IS NO SESSION FOR THIS REQUEST!')
    res.status(301).redirect('/auth')
  } else {
    redisClient.get(req.sessionID, (err, _user) => {
      if (err) {
        res.status(301).redirect('/auth')
      } else {
        // res
        // .cookie(
        //     "SESSION_ID", req.sessionID, {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: "none",
        // })
      }
    })
  }
  next() // otherwise continue
})

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
const staticDir = path.join(__dirname, '/public')
app.use(express.static(staticDir))
app.set('port', process.env.PORT || 8880)

/************************************************************************************
 *                 Show routes called in console during development
 *                 and log to file during production/development
 ***********************************************************************************/
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  app.use(morgan('dev', { stream }))
}

/************************************************************************************
 *                                      Security
 ***********************************************************************************/
if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
}

/************************************************************************************
 *                                      Routes
 ***********************************************************************************/
// app.use('/auth', authRouter)
app.use('/accounts', accountsRouter)
app.use('/contacts', customerRouter)
app.use('/items', productRouter)
app.use('/invoices', invoiceRouter)
app.use('/warehouses', warehouseRouter)
app.use('/api', userRouter)

// app.use(globalErrorController)

/**
 * For all the routes that are not defined
 * @api {get} /api/v1/not-found 404 - Not Found
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
 app.all('*', (req, _res, next) => {
  next(new AppError(`We kunnen "${req.originalUrl}" niet op dit server vinden.`, 404));
});

// Export express instance
export default app
