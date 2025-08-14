import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

// All requests to /api/epic-proxy are handled by this function
app.get('/*', async (req, res) => {
  const targetUrl = 'https://www.getepic.com';

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    let html = await response.text();

    // Remove security meta tags
    html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');

    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy Error: ' + err.message);
  }
});

export default app;
