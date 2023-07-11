// eslint-disable-next-line no-unused-vars
const Bot = require('./Client');
const redis = require('redis');

module.exports = class RedisHandler {
    /**
     *
     * @param {Bot} client Client
     */
    constructor(client) {
        this.client = client;
        this.ready = false;

        const { host, port, db, password } = this.client.config.database.redis

        this.redisClient = redis.createClient({
            socket: {
                host,
                port,
            },
            password,
            database: db
        });

        this.redisClient.on('connect', async () => {
            await this.clearALL();
            this.ready = true;
            this.client.logger.log(`Redis`, `Successfully connected to Redis Database.`);
        });

        this.redisClient.on('end', () => {
            this.ready = false;
            this.client.logger.log('Redis', 'Disconnected from Redis Database. All Caching Paused.')
        });

        this.redisClient.on('error', (err) => {
            this.client.logger.error(err)
        });

        this.connect();
    }
    async connect() {
        await this.redisClient.connect()
    }
    async clearALL() {
        await this.redisClient.flushDb();
    }
    async getHash(key) {
        if (!this.ready) return null;
        if (this.client.debug) this.client.logger.debug('Redis Cache', `Received request for receiving hash data for key: ${key}.`);
        // eslint-disable-next-line new-cap
        const data = await this.redisClient.HGETALL(key);

        if (!data || !Object.keys(data).length) return null;

        return JSON.parse(JSON.stringify(data));
    }
    delete(key) {
        if (!this.ready) return;
        if (this.client.debug) this.client.logger.debug('Redis Cache', `Received request for deleting hash data: ${key}`);
        this.redisClient.del(key);
    }
    deleteHashField(key, field) {
        if (!this.ready) return;
        if (this.client.debug) this.client.logger.debug('Redis Cache', `Received request for deleting hash ${key} field ${field} data`);
        this.redisClient.hDel(key, field);
    }
    async setHash(key, field, value, time) {
        if (!this.ready) return;

        if (this.client.debug) this.client.logger.debug('Redis Cache', `Received request for saving data for key: ${key} of field: ${field}.`);
        let json = false;
        if (typeof value === 'object') json = true;


        await this.redisClient.hSet(key, field, json ? JSON.stringify(value) : value);

        if (time && time !== -1) await this.redisClient.expire(key, time);
    }
    /**
     *
     * @param {string} key Key
     * @param {number} time Time
     * @param {{}} values Values
     */
    async setHashes(key, time, values = {}) {
        if (!this.ready) return;
        if (Object.keys(values).length <= 0) return;

        if (this.client.debug) this.client.logger.debug('Redis Cache', `Received request for saving data for key: ${key}`);

        await this.redisClient.hSet(key, values);

        if (time && time !== -1) await this.redisClient.expire(key, time);
    }
    async getKey(key, json = true) {
        if (!this.ready) return null;
        if (this.client.debug) this.client.logger.debug('Redis Cache', `Received request for receiving data for key: ${key}.`);

        const data = await this.redisClient.get(key);

        if (!data) return null;

        return json ? JSON.parse(data) : data;
    }
    async getHashField(key, field, json = true) {
        if (!this.ready) return null;
        if (this.client.debug) this.client.logger.debug('Redis Cache', `Received request for receiving data for key: ${key} field: ${field}`);

        const data = await this.redisClient.hGet(key, field);
        return json ? JSON.parse(data) : data;
    }
    async setKey(key, data, time) {
        if (!this.ready) return;

        if (this.client.debug) this.client.logger.debug('Redis Cache', `Received request for saving data for key: ${key}.`);
        let json = false;
        if (typeof data === 'object' || Array.isArray(data)) json = true;

        await this.redisClient.set(key, json ? JSON.stringify(data) : data);

        if (time && time !== -1) await this.redisClient.expire(key, time);
    }
}