const axios = require("axios");

const ACCESS_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMnBhMWExMjA3QHZpc2hudS5lZHUuaW4iLCJleHAiOjE3NTM4NTc1MzUsImlhdCI6MTc1Mzg1NjYzNSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijk1NTE0NTc3LTUwYjItNGM4OC1hYjMzLWEyMTE4NzlhMzA2ZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFrdWxhIHRhcnVuIHZlZXJyYWp1a3VtYXIiLCJzdWIiOiJkNjZkOGM5ZC1kNmMzLTQ2MWYtOTkyMy0xOWU1OGVkY2E4M2EifSwiZW1haWwiOiIyMnBhMWExMjA3QHZpc2hudS5lZHUuaW4iLCJuYW1lIjoiYWt1bGEgdGFydW4gdmVlcnJhanVrdW1hciIsInJvbGxObyI6IjIycGExYTEyMDciLCJhY2Nlc3NDb2RlIjoicXhSTXdxIiwiY2xpZW50SUQiOiJkNjZkOGM5ZC1kNmMzLTQ2MWYtOTkyMy0xOWU1OGVkY2E4M2EiLCJjbGllbnRTZWNyZXQiOiJVUVpOYWdEcE13QmpXaEZUIn0.R8CXPndovn2WyPBuGkMXpE3YLTRPZap9Qr6aTURw2B4";

const Log = async (stack, level, pkg, message) => {
  const validStacks = ["backend", "frontend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validPackages = [
    "auth", "config", "middleware", "utils",
    "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service",
    "api", "component", "hook", "page", "state", "style"
  ];

  if (!validStacks.includes(stack) || !validLevels.includes(level) || !validPackages.includes(pkg)) {
    console.error("❌ Invalid log metadata");
    return;
  }

  try {
    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Log sent:", res.data.message);
  } catch (error) {
    console.error("❌ Logging failed:", error.response?.data || error.message);
  }
};

module.exports = Log;
