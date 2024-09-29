const Url = require('../models/urlModel');
const { setUrl, getUrl } = require('../services/redisService');
const generateShortUrl = require('../utils/generateShorturl');

const shortenUrl = async (req, res) => {
    try {
        const { longUrl } = req.body;
        const shortUrl = generateShortUrl();

        const newUrl = new Url({ longUrl, shortUrl });
        await newUrl.save();

        await setUrl(shortUrl, longUrl);  // Await the Redis set operation

        res.status(201).json({ shortUrl });
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const redirectUrl = async (req, res) => {
    try {
        const { shortUrl } = req.params;

        let longUrl = await getUrl(shortUrl);  // Await the Redis get operation

        if (longUrl) {
            return res.redirect(longUrl);
        } else {
            const url = await Url.findOne({ shortUrl });
            if (url) {
                await setUrl(shortUrl, url.longUrl);  // Await the Redis set operation
                return res.redirect(url.longUrl);
            } else {
                return res.status(404).json({ message: 'URL not found' });
            }
        }
    } catch (error) {
        console.error('Error redirecting URL:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { shortenUrl, redirectUrl };
