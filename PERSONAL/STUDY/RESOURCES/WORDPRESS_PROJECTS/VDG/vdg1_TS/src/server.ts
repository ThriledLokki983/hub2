/** @format */
import './index'
import { errorHandler } from './middleware/error'
import app from './app'
require('dotenv').config()
import validateEnv from './utils/validateEnv'
import logger from './utils/logger'

/************************************************************************************
 *              Printing to the console that application is running                *
 *              on the specified port                                              *
 ***********************************************************************************/

validateEnv()

const lines = `=================================`
const env = `======= ENV: ${app.get('env').toUpperCase()} ========`
const info = `🚀 App listening on the port ${app.get('port')}`

const client = app.listen(app.get('port'), () => {
  logger.info(`${lines}`)
  logger.info(`${env}`)
  logger.info(`${info}`)
  logger.info(`${lines}\n`)
  console.log(' *Press CTRL+C to stop\n')
})

/**
 * Global Safety Net for all unhandled errors
 * Safely handling all other unhandled errors that may occur in any ASYNC
 * Code that we couldn't catch
 */
process.on('uncaughtException', (err: Error) => {
  console.log(err.name, err)
  console.log('UNCAUGHT EXCEPTION!!!')
  client.close(() => {
    process.exit(1)
  })
})

app.use(errorHandler)

// k9_37XxGq\''9?NF
// info@wiersma-ict.nl
// https://vdg-order-app.herokuapp.com
//   "watch-node": "npx supervisor dist/server.js",

// PROD Login Details
// Gebr.naam: administratie@vandergangwatches.nl
// WW: Kon88625!2021VDG

// 20045GAGG
