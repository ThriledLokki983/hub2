import dotenv from "dotenv";
import fs from "fs";

import logger from "./logger";
// config.env
// config-dev.env
if (fs.existsSync("./config.env") && fs.existsSync("./config-dev.env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: "./config-dev.env" }); //!CHANGE CONFIG FILE NAME HERE
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" }); // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENV;

export const REDIS_PORT = process.env["REDIS_PORT"] as string;
export const API_BASE_AUTH = process.env["API_BASE_AUTH"] as string;
export const API_BASE_URL = process.env["API_BASE_URL"] as string;
export const API_DIV_URL = process.env["API_DIV_URL"] as string;
export const API_TOKEN = process.env["API_ACCESS_TOKEN"] as string;
export const API_REFRESH_TOKEN = process.env["API_REFRESH_TOKEN"] as string;
export const API_CUSTOMER_DIVISION = process.env["API_CUSTOMER_DIVISION"] as string;
export const API_BULK_CUSTOMER_DIVISION = process.env["API_BULK_CUSTOMER_DIVISION"] as string;
export const API_ITEMS_DIVISION = process.env["API_ITEMS_DIVISION"] as string;
export const API_SALES_DIVISION = process.env["API_SALES_DIVISION"] as string;
export const API_INVOICE_DIVISION = process.env["API_INVOICE_DIVISION"] as string;
export const RESPONSE_TYPE = process.env["RESPONSE_TYPE"] as string;
export const FORCE_LOGIN = process.env["FORCE_LOGIN"] as unknown as number;
export const API_REFRESH_TOKEN_URL = process.env["API_REFRESH_TOKEN_URL"] as string;
export const ACCESS_CODE = process.env["ACCESS_CODE"] as string;
export const REDIRECT_URI = process.env["REDIRECT_URI"] as string;
export const GRANT_TYPE = process.env["GRANT_TYPE"] as string;
export const GRANT_TYPE_REFRESH = process.env["GRANT_TYPE_REFRESH"] as string;
export const CLIENT_ID = process.env["CLIENT_ID"] as string;
export const CLIENT_SECRET = process.env["CLIENT_SECRET"] as string;
export const API_WAREHOUSE_ID = process.env["API_WAREHOUSE_ID"] as string;
export const API_WAREHOUSE_DIVISION = process.env["API_WAREHOUSE_DIVISION"] as string;
export const WATCH_CODE = process.env["WATCH_CODE"] as string;
export const BAND_CODE = process.env["BAND_CODE"] as string;
