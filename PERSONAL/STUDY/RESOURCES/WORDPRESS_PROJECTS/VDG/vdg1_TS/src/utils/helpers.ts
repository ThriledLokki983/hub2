import fs from 'fs'
import moment from 'moment';
import { promisify } from 'util'
import { Request } from 'express';

import { Session, TokenData } from '../utils/devTypes';

const appendFileAsync = promisify(fs.appendFile)
const readFileAsync = promisify(fs.readFile)

/************************************************************************************
 *              Reading the refresh token from the file and sending                 *
 *              It to controller to use for making request to Exact-API             *
 ***********************************************************************************/

/**
 * Read the file asynchronously
 * @returns {Promise} | Promise - returns the data from the file
 */
const readFile = async () => {
  const result = await readFileAsync('./src/utils/refresh_Secrets.json')
  return await JSON.parse(Buffer.from(result).toString())
}


/**
 * Async function to read the data and send it to controller
 * @param access | string - access_token
 * @returns {access_token | refresh_token} | String - returns access_token or refresh_token
 */
const getAccessToken = async (access = true) => {
  const data = await readFile()
  if (new Date(`${data.expires}`) > new Date()) {
    return access
      ? data.access_token
      : data.refresh_token
  }
}


/**
 * ERROR LOGGER - Logs the error to the file
 * Async function to append new error error message to a file
 * @param location | string - location of the file
 * @param error | string - error message
 */
export const logError = async (location: string, error: string) => {
  await appendFileAsync('./src/utils/error_logs.log', `[[${location.toUpperCase()}]] [${new Date()}]: \t {${error}}\n`
  )
}


export const isSessionExpired = (req: Request) => {
  const { user } = requestData(req);
  const now = moment();
  const sessionDate = moment(req.session.cookie.expires);
  const isNotExpired = moment(now).isSameOrBefore(sessionDate);

  return { user, isNotExpired }
}


export const isAccessTokenExpired = (data: TokenData) => {
  const now = moment();
  const expires = moment(data.expires);
  const isNotExpired = moment(expires).isAfter(now);
  const isExpired = moment(expires).isBefore(now);

  return { isNotExpired, isExpired }
}


export function requestData(req: Request) {
  const { session, body } = req;
  const { user } = session as unknown as Session;

  return { user, session, body };
}


export const headerOptions = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
  },
}


export const calculateNewExpiryDate = (data: TokenData) => {
  const { expires_in } = data;
  const minutesToAdd = parseInt(expires_in as any) / 60;
  const minInSeconds = minutesToAdd * 60000;
  const newExpireTime = new Date(new Date().getTime() + minInSeconds);

  return { newExpireTime };

}


export const writeFile = async (data: TokenData) => {
  fs.writeFile(
    './src/utils/refresh_Secrets.json',
    JSON.stringify(data),
    async (error) => {
      if (error) {
        await logError('writing refresh token', error.message)
      }
    }
  )
}


// Exporting the functions to be used in other files
export default {
  getAccessToken,
  logError,
}
