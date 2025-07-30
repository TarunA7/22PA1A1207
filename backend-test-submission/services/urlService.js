const { shortUrls } = require("../data/store");
const generateShortCode = require("../utils/shortCodeGenerator");

function createShortUrl({ url, shortcode, validity }) {
  const expiryTime = new Date(Date.now() + (validity || 30) * 60000);
  const code = shortcode || generateShortCode();
  if (shortUrls[code]) throw new Error("Shortcode already exists");

  shortUrls[code] = {
    url,
    createdAt: new Date(),
    expiry: expiryTime,
    clicks: [],
  };

  return { shortcode: code, expiry: expiryTime };
}

function getAnalytics(code) {
  const data = shortUrls[code];
  if (!data) throw new Error("Shortcode not found");

  return {
    url: data.url,
    createdAt: data.createdAt,
    expiry: data.expiry,
    clickCount: data.clicks.length,
    clicks: data.clicks,
  };
}

function recordClick(code, source, location) {
  if (!shortUrls[code]) return;
  shortUrls[code].clicks.push({
    timestamp: new Date(),
    source,
    location,
  });
}

function isExpired(code) {
  return shortUrls[code] && new Date() > new Date(shortUrls[code].expiry);
}

module.exports = { createShortUrl, getAnalytics, recordClick, isExpired };
