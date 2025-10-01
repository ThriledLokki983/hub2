/** @format */
import axios from "axios";
import fs from "fs";
import qs from "qs";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { ResponseProps, Session } from "../utils/devTypes";
import helper, {
    isSessionExpired,
    requestData,
    // headerOptions as options,
    calculateNewExpiryDate,
} from "../utils/helpers";
import {
    API_BASE_AUTH,
    API_REFRESH_TOKEN_URL,
    REDIRECT_URI,
    GRANT_TYPE,
    GRANT_TYPE_REFRESH,
    CLIENT_ID,
    CLIENT_SECRET,
} from "../utils/secrets";
import logger from "./../utils/logger";
import path from "path";

/************************************************************************************
 **             AUTHENTICATING THE USER WITH EXACT-API                             **
 **             If User authenticates - they get access to the application         **
 **             Controllers to handle refreshing the access_token and              **
 **             Redirecting to Exact-API login page.                               **
 ***********************************************************************************/

/**
 * check if session for the user already exists, if not, redirect to Exact-API to login and set a session for the user
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - redirect the user to Exact-API to login or to the homepage
 */
export const login = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { user, isNotExpired } = isSessionExpired(req);

    if (user && isNotExpired) {
        logger.info("REDIRECTING USER TO HOMEPAGE-FROM SERVER");
        // res.redirect("/");
        res
        .status(200)
        .redirect(REDIRECT_URI)
    }
    else if (!user && !isNotExpired) {
        logger.info("REDIRECTING USER TO EXACT-API LOGIN PAGE");

        res.status(401).json({
            status: "success",
            message:
                "No session for this user, needs to re-authenticate with Exact and then come back to the application",
            data: {
                isNotExpired,
                user,
            },
        });
    }
    else {
        logger.info(
            "USER NOT AUTHENTICATED WITH EXACT --- REDIRECTING USER TO EXACT-API LOGIN PAGE"
        );

        res
        .status(301)
        .redirect(API_BASE_AUTH);
    }
});

/**
 * Endpoint to destroy session and logout the user
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - destroys the session and redirects the user to the login page
 */

export const logout = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    (req.session as unknown as Session).user = undefined;
    const { session } = requestData(req);

    session.destroy((err) => {
        if (err) {
            return logger.info(err);
        } else {
            logger.info("USER LOGGED OUT");
            // render the login page
            res.sendFile(path.join(__dirname + "../../../dist/public/login.html"));
            return;
        }
    });
});

/**
 * Endpoint to get the 1st refresh_token and access_token from the Exact-API
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - write the new access_token and the refresh_token to file
 */
export const getRefreshToken = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
        logger.info("Getting the first refresh token.......");

        const options = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
          },
        }
        const {
            body: { code },
            session,
        } = req;

        console.log(req.body);

        const codeDecoded = code && decodeURI(code);

        (session as any).user = codeDecoded;
        const isValidCode =
            codeDecoded !== "" &&
            codeDecoded.length > 0 &&
            codeDecoded !== undefined &&
            codeDecoded !== null;

        let data;
        if (!isValidCode) {
            logger.info("No code received from Exact-API");
            data = {
                status: "error",
                message: "No code received from Exact-API",
            };
        } else {
            const body = {
                code: codeDecoded,
                redirect_uri: REDIRECT_URI,
                grant_type: GRANT_TYPE,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            };
            // make the post request with axios
            data = await axios
                .post(API_REFRESH_TOKEN_URL, qs.stringify(body), options)
                .then((resp: ResponseProps) => {
                    return resp.data;
                })
                .catch(async (error: any) => {
                    if (error.response.data) {
                        await helper.logError("getRefreshToken", error.data.error_description);
                        throw new Error(error.response.data.error.message.value);
                    } else {
                        await helper.logError("getRefreshToken", error.message);
                        throw new Error(error.message);
                    }
                });
        }

        const { newExpireTime } = calculateNewExpiryDate(data);
        // const minutesToAdd = parseInt((data as any).expires_in) / 60;
        // const minInSeconds = minutesToAdd * 60000;
        // const newExpireTime = new Date(new Date().getTime() + minInSeconds);
        (data as any).expires = newExpireTime;

        // console.log("DATA", data);


        // write data to file
        fs.writeFile("./src/utils/refresh_Secrets.json", JSON.stringify(data), async (error) => {
            if (error) {
                await helper.logError("writing refresh token", error.message);
            }
        });

        // send response
        res
        .cookie(
            "SESSION_ID", req.sessionID, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
        })
        .status(200)
            .json({
                status: "Success",
                data: {
                    data,
                },
            })
            .redirect("/");
    }
);

/**
 * Endpoint to get a new access_token from the Exact-API using the refresh_token
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - write the new access_token and the refresh_token to file
 */
export const refreshToken = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
        const options = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let data = await axios
            .post(
                API_REFRESH_TOKEN_URL,
                JSON.stringify({
                    refresh_token: `${await helper.getAccessToken(false)}`,
                    grant_type: GRANT_TYPE_REFRESH,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                }),
                options
            )
            .then((resp: ResponseProps) => {
                return resp.data;
            })
            .catch(async (error: any) => {
                if (error.response.data) {
                    await helper.logError("refreshToken", error.message);
                    throw new Error(error.response.data.error_description);
                } else {
                    await helper.logError("refreshToken", error.message);
                    throw new Error(error.message);
                }
            });

        const minutesToAdd = parseInt((data as any).expires_in) / 60;
        const newExpireTime =
            new Date(new Date().getTime() + minutesToAdd * 60000).getTime() + 3600;
        (data as any).expires = newExpireTime;

        // write data to file
        fs.writeFile("./src/utils/refresh_Secrets.json", JSON.stringify(data), async (error) => {
            if (error) {
                await helper.logError("writing refresh token", error.message);
            }
        });

        res.status(200).json({
            status: "Success",
            data: {
                data,
            },
        });
    }
);

export default {
    login,
    logout,
    getRefreshToken,
    refreshToken,
};
