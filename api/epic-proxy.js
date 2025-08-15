let cookieJar = {}; // Cookie memorizzati lato serverless

export default async function handler(req, res) {
  try {
    const targetUrl = req.query.url || 'https://www.getepic.com';
    const urlObj = new URL(targetUrl);
    const baseOrigin = urlObj.origin;

    const cookieHeader = Object.entries(cookieJar)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {}),
        ...(req.headers['content-type'] ? { 'Content-Type': req.headers['content-type'] } : {})
      },
      method: req.method,
      body: req.method === 'POST' ? req.body : undefined,
      redirect: 'manual'
    });

    const setCookies = response.headers.getSetCookie?.() || [];
    setCookies.forEach(cookieStr => {
      const [cookiePart] = cookieStr.split(';');
      const [name, value] = cookiePart.split('=');
      cookieJar[name] = value;
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      let html = await response.text();

      // Rimuove protezioni meta
      html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');

      // Riscrive link e script per passare dal proxy
      html = html.replace(/(href|src|action)="\/(.*?)"/g, (_, attr, path) =>
        `${attr}="/api/epic-proxy?url=${encodeURIComponent(baseOrigin + '/' + path)}"`
      );
      html = html.replace(/(href|src|action)="https:\/\/www\.getepic\.com(.*?)"/g, (_, attr, path) =>
        `${attr}="/api/epic-proxy?url=${encodeURIComponent('https://www.getepic.com' + path)}"`
      );

      // Inietta script per intercettare fetch/XHR/WebSocket
      const injectScript = `
        <script>
          (function() {
            const originalFetch = window.fetch;
            window.fetch = function(input, init) {
              if (typeof input === 'string' && input.startsWith('/')) {
                input = '/api/epic-proxy?url=' + encodeURIComponent(location.origin + input);
              } else if (typeof input === 'string' && input.startsWith('https://www.getepic.com')) {
                input = '/api/epic-proxy?url=' + encodeURIComponent(input);
              }
              return originalFetch(input, init);
            };

            const OriginalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
              const xhr = new OriginalXHR();
              const open = xhr.open;
              xhr.open = function(method, url, ...rest) {
                if (url.startsWith('/') || url.startsWith('https://www.getepic.com')) {
                  url = '/api/epic-proxy?url=' + encodeURIComponent(
                    url.startsWith('/') ? location.origin + url : url
                  );
                }
                return open.call(this, method, url, ...rest);
              };
              return xhr;
            };

            const OriginalWS = window.WebSocket;
            window.WebSocket = function(url, protocols) {
              if (url.startsWith('wss://www.getepic.com')) {
                url = '/api/epic-proxy?url=' + encodeURIComponent(url);
              }
              return new OriginalWS(url, protocols);
            };
          })();
        </script>
      `;
      html = html.replace('</body>', injectScript + '</body>');

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } else {
      // Risorse statiche
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
