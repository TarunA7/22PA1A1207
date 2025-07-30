import React, { useState } from "react";
import {
  Button, TextField, Typography, Paper, List, ListItem, Divider
} from "@mui/material";
import axios from "axios";
import Log from "../utils/logger"; // your reusable logger

const StatisticsPage = () => {
  const [shortCode, setShortCode] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setError("");
    try {
      Log("frontend", "info", "component", `Fetching stats for ${shortCode}`);
      const res = await axios.get(`http://localhost:5000/shorturls/${shortCode}`);
      setStats(res.data);
      Log("frontend", "info", "component", `Stats received for ${shortCode}`);
    } catch (err) {
      console.error(err);
      setStats(null);
      setError("Failed to fetch statistics.");
      Log("frontend", "error", "component", `Error fetching stats: ${err.message}`);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h5" gutterBottom>
        📊 URL Statistics
      </Typography>

      <TextField
        label="Enter Shortcode"
        value={shortCode}
        onChange={(e) => setShortCode(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={fetchStats}
        disabled={!shortCode}
      >
        Get Stats
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      {stats && (
        <div style={{ marginTop: 20 }}>
          <Typography><strong>Short URL:</strong> {window.location.origin}/{shortCode}</Typography>
          <Typography><strong>Original URL:</strong> {stats.originalUrl}</Typography>
          <Typography><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</Typography>
          <Typography><strong>Expiry:</strong> {new Date(stats.expiry).toLocaleString()}</Typography>
          <Typography><strong>Total Clicks:</strong> {stats.clicks.length}</Typography>

          <Divider style={{ margin: "20px 0" }} />
          <Typography variant="h6">🔍 Click Logs</Typography>

          <List>
            {stats.clicks.map((click, index) => (
              <ListItem key={index}>
                <Typography>
                  🕒 <strong>{new Date(click.timestamp).toLocaleString()}</strong> | 🌍 <strong>{click.location || "Unknown"}</strong> | 🔗 Referrer: {click.referrer || "N/A"}
                </Typography>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Paper>
  );
};

export default StatisticsPage;
