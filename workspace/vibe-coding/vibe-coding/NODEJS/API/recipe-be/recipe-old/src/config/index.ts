import { config } from 'dotenv';
import * as envalid from 'envalid';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Validate environment variables
const env = envalid.cleanEnv(process.env, {
  NODE_ENV: envalid.str({ choices: ['development', 'test', 'production'] }),
  PORT: envalid.port(),
  SECRET_TOKEN: envalid.str(),
  DB_USER: envalid.str(),
  DB_PASSWORD: envalid.str(),
  DB_HOST: envalid.str(),
  DB_PORT: envalid.port(),
  DB_NAME: envalid.str(),
  DB_DIALECT: envalid.str(),
  CREDENTIALS: envalid.bool({ default: false }),
  LOG_FORMAT: envalid.str({ default: 'dev' }),
  LOG_DIR: envalid.str({ default: '../logs' }),
  ORIGIN: envalid.str({ default: '*' }),
});

export const CREDENTIALS = env.CREDENTIALS === true;
export const { NODE_ENV, PORT, SECRET_TOKEN } = env;
export const LOG_FORMAT = env.LOG_FORMAT;
export const LOG_DIR = env.LOG_DIR;
export const ORIGIN = env.ORIGIN;
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DB_DIALECT } =
  env;
