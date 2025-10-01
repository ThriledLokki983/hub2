import { config } from 'dotenv';
const _path = ".env" || "../../.env";
// config({ path: `${_path}.${ process.env.NODE_ENV }.local`, debug: Boolean(process.env.DEBUG) });
config({ path: `${_path}.${ process.env.NODE_ENV }.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
    // APP/SERVER SETTINGS
    NODE_ENV,
    PORT,
    HOST,
    SECRET_KEY,
    LOG_FORMAT,
    LOG_DIR,
    ORIGIN ,

    // EXACT ONLINE API/AUTH URLS
    API_BASE_AUTH,
    API_BASE_URL,
    API_DIV_URL,
    REDIRECT_URI,
    API_REFRESH_TOKEN_URL,

    // TEST IDs
    API_WAREHOUSE_ID,

    // DIVISIONS
    API_CUSTOMER_DIVISION,
    API_ITEMS_DIVISION,
    API_SALES_DIVISION,
    API_INVOICE_DIVISION,
    API_PURCHASE_DIVISION,
    API_WAREHOUSE_DIVISION,

    //  AUTHENTICATION
    CLIENT_ID,
    CLIENT_SECRET,
    WEBHOOK_SECRET,
    RESPONSE_TYPE,
    FORCE_LOGIN,
    GRANT_TYPE,
    GRANT_TYPE_REFRESH,

    // SESSION
    SESSION_SECRET,
    REDIS_PORT,
    REDIS_URL,
} = process.env;
