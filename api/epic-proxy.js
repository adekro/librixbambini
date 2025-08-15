import fetch from 'node-fetch';

export default async function handler(req, res) {
  const targetUrl = 'https://www.getepic.com';
  const path = req.url.replace('/api/epic-proxy', '') || '/';
  const url = targetUrl + path;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    let html = await response.text();

    // Rewrite risorse relative in modo che passino dal proxy
    html = html.replace(/(href|src)="\//g, `$1="/api/epic-proxy/`);

    // CORS e iframe consentiti
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Type', 'text/html');

    return res.status(response.status).send(html);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).send('Proxy error');
  }
}
