// jwtBlacklist.ts
import { Redis } from 'ioredis';
import jwt from 'jsonwebtoken';
import { logger } from '@utils/logger';

/**
 * Class to handle JWT token blacklisting using Redis
 * with fallback to memory-based blacklist when Redis is unavailable
 */
export class JwtBlacklist {
  private redis: Redis;
  private readonly keyPrefix = 'blacklist:';
  private redisAvailable = true;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  // Memory fallback for Redis unavailability
  private memoryBlacklist: Map<string, number> = new Map();
  private memoryCleanupInterval: NodeJS.Timeout | null = null;

  constructor(redisClient: Redis) {
    this.redis = redisClient;
    this.setupHealthCheck();
    this.setupMemoryCleanup();

    // Monitor Redis connection events
    this.redis.on('error', err => {
      logger.error(`Redis Error: ${err.message}`);
      this.redisAvailable = false;
    });

    this.redis.on('ready', () => {
      logger.info('Redis connection established');
      this.redisAvailable = true;
    });

    this.redis.on('reconnecting', () => {
      logger.info('Redis client reconnecting');
    });

    this.redis.on('end', () => {
      logger.warn('Redis connection closed');
      this.redisAvailable = false;
    });
  }

  /**
   * Setup a health check interval to periodically verify Redis connectivity
   */
  private setupHealthCheck() {
    // Clear any existing interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.redis.ping();
        if (!this.redisAvailable) {
          logger.info('Redis connection restored');
          this.redisAvailable = true;
        }
      } catch (err) {
        if (this.redisAvailable) {
          logger.error(`Redis health check failed: ${err instanceof Error ? err.message : String(err)}`);
          this.redisAvailable = false;
        }
      }
    }, 30000); // 30 seconds
  }

  /**
   * Setup memory cleanup for in-memory blacklist when Redis is unavailable
   */
  private setupMemoryCleanup() {
    // Clear any existing interval
    if (this.memoryCleanupInterval) {
      clearInterval(this.memoryCleanupInterval);
    }

    // Check every minute for expired tokens
    this.memoryCleanupInterval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      let expired = 0;

      this.memoryBlacklist.forEach((expiry, token) => {
        if (expiry <= now) {
          this.memoryBlacklist.delete(token);
          expired++;
        }
      });

      if (expired > 0) {
        logger.debug(`Memory blacklist cleanup: removed ${expired} expired tokens`);
      }
    }, 60000); // 60 seconds
  }

  /**
   * Check if Redis is available
   */
  public isRedisAvailable(): boolean {
    return this.redisAvailable;
  }

  /**
   * Adds a token to the blacklist until it expires.
   * @param token JWT string
   * @returns Promise resolving to true if blacklisting was successful
   */
  async blacklistToken(token: string): Promise<boolean> {
    try {
      const decoded: any = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        logger.warn('Invalid token format: missing exp claim');
        throw new Error('Invalid token: missing exp claim');
      }

      const ttl = decoded.exp - Math.floor(Date.now() / 1000); // seconds
      if (ttl <= 0) {
        logger.info('Token already expired, no need to blacklist');
        return true; // Already expired, no need to blacklist
      }

      if (!this.redisAvailable) {
        // Fallback to in-memory blacklist
        logger.warn('Redis unavailable, using memory fallback for token blacklisting');
        this.memoryBlacklist.set(token, decoded.exp);
        logger.debug(`Token blacklisted in memory for ${ttl} seconds`);
        return true;
      }

      // Add to blacklist with expiry
      await this.redis.set(`${this.keyPrefix}${token}`, '1', 'EX', ttl);
      logger.debug(`Token blacklisted for ${ttl} seconds`);
      return true;
    } catch (err) {
      logger.error(`Failed to blacklist token: ${err instanceof Error ? err.message : String(err)}`);
      // Don't throw the error, but return false to indicate failure
      return false;
    }
  }

  /**
   * Checks if a token is blacklisted.
   * @param token JWT string
   * @returns true if blacklisted, false otherwise
   */
  async isBlacklisted(token: string): Promise<boolean> {
    try {
      // First check memory blacklist as it's faster
      if (this.memoryBlacklist.has(token)) {
        return true;
      }

      if (!this.redisAvailable) {
        logger.warn('Redis unavailable during blacklist check, using memory fallback only');
        return false; // Not in memory blacklist
      }

      const exists = await this.redis.exists(`${this.keyPrefix}${token}`);
      return exists === 1;
    } catch (err) {
      logger.error(`Error checking blacklisted token: ${err instanceof Error ? err.message : String(err)}`);
      // In case of Redis error, check memory fallback
      return this.memoryBlacklist.has(token);
    }
  }

  /**
   * Clears all blacklisted tokens (admin use only)
   * @returns number of tokens cleared
   */
  async clearAllBlacklisted(): Promise<number> {
    try {
      let totalCleared = 0;

      // Clear memory blacklist
      const memoryCount = this.memoryBlacklist.size;
      this.memoryBlacklist.clear();
      totalCleared += memoryCount;
      logger.info(`Cleared ${memoryCount} blacklisted tokens from memory`);

      if (!this.redisAvailable) {
        logger.warn('Redis unavailable, only cleared memory blacklist');
        return totalCleared;
      }

      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        const deleted = await this.redis.del(...keys);
        logger.info(`Cleared ${deleted} blacklisted tokens from Redis`);
        totalCleared += deleted;
      }

      return totalCleared;
    } catch (err) {
      logger.error(`Error clearing blacklisted tokens: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  }

  /**
   * Clean up resources when this class is no longer needed
   */
  public destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.memoryCleanupInterval) {
      clearInterval(this.memoryCleanupInterval);
      this.memoryCleanupInterval = null;
    }
  }
}

export default JwtBlacklist;
