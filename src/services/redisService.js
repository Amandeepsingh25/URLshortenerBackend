const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

const connectClient = async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error('Redis connection error:', err);
    }
};

const setUrl = async (shortUrl, longUrl) => {
    try {
        await client.set(shortUrl, longUrl);
    } catch (err) {
        console.error('Error setting URL in Redis:', err);
    }
};

const getUrl = async (shortUrl) => {
    try {
        return await client.get(shortUrl);
    } catch (err) {
        console.error('Error getting URL from Redis:', err);
    }
};

connectClient();

module.exports = { setUrl, getUrl, client };
