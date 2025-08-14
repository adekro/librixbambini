import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const targetUrl = 'https://www.getepic.com';

    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    let html = await response.text();

    // Rimuovi meta di sicurezza
    html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore nel proxy: ' + err.message);
  }
}
