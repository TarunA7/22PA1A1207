const {
  createShortUrl,
  getAnalytics,
  recordClick,
  isExpired,
} = require("../services/urlService");
const Log = require("../log");

const hostname = "http://localhost:3001";

exports.createShortUrlHandler = async (req, res) => {
  const { url, validity, shortcode } = req.body;
  try {
    const { shortcode: code, expiry } = createShortUrl({ url, validity, shortcode });
    await Log("backend", "info", "controller", `Short URL created for ${url}`);
    res.status(201).json({
      shortLink: `${hostname}/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (error) {
    await Log("backend", "error", "controller", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.getShortUrlStatsHandler = async (req, res) => {
  const code = req.params.code;
  try {
    const data = getAnalytics(code);
    await Log("backend", "info", "controller", `Stats fetched for ${code}`);
    res.json(data);
  } catch (error) {
    await Log("backend", "error", "controller", error.message);
    res.status(404).json({ error: error.message });
  }
};

exports.redirectHandler = async (req, res) => {
  const code = req.params.code;
  try {
    if (!isExpired(code)) {
      const { url } = require("../data/store").shortUrls[code];
      const source = req.get("Referer") || "unknown";
      const location = req.ip || "unknown";
      recordClick(code, source, location);
      await Log("backend", "info", "controller", `Redirected to ${url}`);
      res.redirect(url);
    } else {
      await Log("backend", "warn", "controller", `Expired shortcode: ${code}`);
      res.status(410).json({ error: "Link expired" });
    }
  } catch {
    await Log("backend", "error", "controller", `Shortcode not found: ${code}`);
    res.status(404).json({ error: "Shortcode not found" });
  }
};
