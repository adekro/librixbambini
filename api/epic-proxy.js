let cookieJar = {}; // Memoria cookie in RAM per sessione

export default async function handler(req, res) {
  try {
    const targetUrl = req.query.url || 'https://www.getepic.com';
    const urlObj = new URL(targetUrl);
    const baseOrigin = urlObj.origin;

    // Invia cookie salvati (se presenti) alla destinazione
    const cookieHeader = Object.entries(cookieJar)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
      },
      method: req.method,
      body: req.method === 'POST' ? req.body : undefined,
      redirect: 'manual'
    });

    // Salva cookie restituiti dal server
    const setCookies = response.headers.getSetCookie?.() || [];
    setCookies.forEach(cookieStr => {
      const [cookiePart] = cookieStr.split(';');
      const [name, value] = cookiePart.split('=');
      cookieJar[name] = value;
    });

    let contentType = response.headers.get('content-type') || '';

    // Se è HTML → riscrive link e script
    if (contentType.includes('text/html')) {
      let html = await response.text();

      // Rimuove CSP e X-Frame
      html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');

      // Riscrive URL relativi → proxy
      html = html.replace(/(href|src|action)="\/(.*?)"/g, (_, attr, path) => {
        return `${attr}="/api/epic-proxy?url=${encodeURIComponent(baseOrigin + '/' + path)}"`;
      });

      // Riscrive URL assoluti verso getepic
      html = html.replace(/(href|src|action)="https:\/\/www\.getepic\.com(.*?)"/g, (_, attr, path) => {
        return `${attr}="/api/epic-proxy?url=${encodeURIComponent('https://www.getepic.com' + path)}"`;
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);

    } else {
      // Non HTML (JS, CSS, immagini, JSON) → passthrough
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', contentType);
      const buffer = await response.arrayBuffer();
      res.status(200).send(Buffer.from(buffer));
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Errore nel proxy: ' + err.message);
  }
}
