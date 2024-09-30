import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new Redis client.
   * @returns {RedisClient}
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if the client is connected.
   * @returns {Boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Gets the value of a given key.
   * @param {String} key The key of the item to get.
   * @returns {Promise<String>}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Sets the value of a given key.
   * @param {String} key The key of the item to set.
   * @param {String} value The value of the item to set.
   * @param {Number} duration The duration of the item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Deletes a given key.
   * @param {String} key The key of the item to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;