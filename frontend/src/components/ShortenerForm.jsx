import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography } from '@mui/material';
import logger from '../utils/logger';

const ShortenerForm = () => {
  const [inputs, setInputs] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL + '/shorturls';
    const output = [];

    for (const input of inputs) {
      try {
        const res = await axios.post(backendUrl, input);
        output.push(res.data);
        await logger("frontend", "info", "component", `Short URL created for ${input.url}`);
      } catch (err) {
        await logger("frontend", "error", "component", `Failed to shorten URL: ${err.message}`);
        output.push({ error: err.response?.data || err.message });
      }
    }
    setResults(output);
  };

  return (
    <div>
      <Typography variant="h4">URL Shortener</Typography>
      {inputs.map((input, i) => (
        <Grid container spacing={2} key={i}>
          <Grid item xs={12}>
            <TextField fullWidth label="Long URL" value={input.url}
              onChange={(e) => handleInputChange(i, 'url', e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Validity (mins)" value={input.validity}
              onChange={(e) => handleInputChange(i, 'validity', e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Shortcode" value={input.shortcode}
              onChange={(e) => handleInputChange(i, 'shortcode', e.target.value)} />
          </Grid>
        </Grid>
      ))}
      <Button variant="contained" onClick={handleAddInput}>Add Another</Button>
      <Button variant="contained" onClick={handleSubmit}>Shorten URLs</Button>

      {results.map((r, idx) => (
        <div key={idx}>
          {r.shortLink ? (
            <p>
              Shortened: <a href={r.shortLink}>{r.shortLink}</a> | Expires: {r.expiry}
            </p>
          ) : (
            <p>Error: {JSON.stringify(r.error)}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShortenerForm;
