const express = require("express");
const bodyParser = require("body-parser");
const loggingMiddleware = require("./middleware/loggingMiddleware");
const {
  createShortUrlHandler,
  getShortUrlStatsHandler,
  redirectHandler,
} = require("./controllers/urlController");

const app = express();
app.use(bodyParser.json());
app.use(loggingMiddleware);

// Create short URL
app.post("/shorturls", createShortUrlHandler);

// Get analytics
app.get("/shorturls/:code", getShortUrlStatsHandler);

// Redirect
app.get("/:code", redirectHandler);

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 URL Shortener running at http://localhost:${PORT}`);
});
