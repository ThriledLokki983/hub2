import { cleanEnv, port, str, num, bool, url } from 'envalid';

export const ValidateEnv = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 3000 }),
    
    // Database
    POSTGRES_HOST: str({ default: 'localhost' }),
    POSTGRES_PORT: port({ default: 5432 }),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),
    POSTGRES_SSL: bool({ default: false }),
    
    // Redis
    REDIS_HOST: str({ default: 'localhost' }),
    REDIS_PORT: port({ default: 6379 }),
    
    // Security
    SECRET_KEY: str({ minLength: 32 }),
    JWT_SECRET: str({ minLength: 32 }),
    JWT_EXPIRES_IN: str({ default: '24h' }),
    BCRYPT_ROUNDS: num({ default: 12 }),
    
    // CORS
    ORIGIN: str({ default: '*' }),
    CREDENTIALS: bool({ default: true }),
    
    // Logging
    LOG_LEVEL: str({ choices: ['error', 'warn', 'info', 'debug'], default: 'info' }),
    LOG_FORMAT: str({ default: 'combined' }),
    LOG_DIR: str({ default: './logs' }),
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: num({ default: 900000 }),
    RATE_LIMIT_MAX_REQUESTS: num({ default: 100 }),
  });
};
