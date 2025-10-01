import fs from "fs";
import { promisify } from "util";
import axios from "axios";
import qs from "qs";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { API_REFRESH_TOKEN_URL, CLIENT_ID, CLIENT_SECRET } from "../utils/secrets";
import { ResponseProps, TokenData } from "../utils/devTypes";
import helper, { isAccessTokenExpired, calculateNewExpiryDate, writeFile } from "../utils/helpers";
import logger from "../utils/logger";
const readFileAsync = promisify(fs.readFile);

/************************************************************************************
 *              Reading the refresh token from the file and checking                *
 *              If the access_token is still valid or not. If it is still           *
 *              Valid, continue else make a request to Exact-API using the          *
 *              Refresh_token to get a new access_token.                            *
 ***********************************************************************************/

/**
 * Read data from the file asynchronously
 * @returns {Promise} | Promise - returns the data from the file
 */
const readFile = async (): Promise<any> => {
    const result = await readFileAsync("./src/utils/refresh_Secrets.json");
    return await JSON.parse(Buffer.from(result).toString());
};

/**
 * Check if the access_token is still valid or not
 * If access_token is still valid, continue
 * Else make a request to Exact-API using the refresh_token to get a new access_token
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - write the new access_token and the refresh_token to file
 */
export const refreshToken = catchAsync(async (_req: Request, res: Response, next: NextFunction) => {
    logger.info(`TRYING TO  REFRESH TOKEN`);
    const data = await readFile();
    const { refresh_token } = data;
    const { isNotExpired, isExpired } = data && isAccessTokenExpired(data);

    if (isNotExpired) {
        logger.info(`TOKEN IS STILL VALID`);
        next();
    } else if (isExpired) {
        logger.info(`TOKEN IS INVALID - GETTING A NEW ACCESS TOKEN`);
        await makeRequest(refresh_token, res);
        next();
    }
});

/**
 * Make a request to Exact-API using the refresh_token to get a new access_token
 * Write the new access_token and the refresh_token to file
 * @param token | string - refresh_token
 * @param res | Response
 * @return {Promise} | Promise - write the new access_token and the refresh_token to file
 */
const makeRequest = async (token: string, _res: Response): Promise<any> => {
    logger.info("REFRESHING TOKEN");
    const options = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const response = (await axios
        .post(
            `${API_REFRESH_TOKEN_URL}`,
            qs.stringify({
                refresh_token: `${token}`,
                grant_type: "refresh_token",
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            options
        )
        .then((resp: ResponseProps) => {
            // console.log(resp);

            return resp.data;
        })
        .catch(async (error: any) => {
            // console.log(error);
            if ((error as any).response.data) {
                await helper.logError("refreshToken", error.response.data.error_description);
                // res.status(400).redirect("/");
                throw new Error((error as any).response.data.error_description);
            } else {
                await helper.logError("refreshToken", error.message);
                throw new Error(error.message);
            }
        })) as unknown as TokenData;

    const { newExpireTime } = calculateNewExpiryDate(response);
    (response as any).expires = newExpireTime;
    writeFile(response);
};
