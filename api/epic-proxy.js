import fetch from 'node-fetch';

export default async function handler(req, res) {
  const targetUrl = 'https://www.getepic.com';
  const path = req.url.replace('/api/epic-proxy', '') || '/';
  const fullTargetUrl = targetUrl + path;

  try {
    const response = await fetch(fullTargetUrl, {
      headers: {
        ...req.headers,
        'host': new URL(targetUrl).host,
        'referer': targetUrl,
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || '';

    // For non-HTML content, just pipe it through
    if (!contentType.includes('text/html')) {
      // Set all headers from the original response
      response.headers.forEach((value, name) => {
        const lowerCaseName = name.toLowerCase();
        // These headers are problematic and should be handled by the proxy server itself
        if (lowerCaseName !== 'content-encoding' && lowerCaseName !== 'transfer-encoding' && lowerCaseName !== 'content-length') {
            res.setHeader(name, value);
        }
      });
      // Use response.body which is a stream and pipe it to the response
      return response.body.pipe(res.status(response.status));
    }

    let html = await response.text();

    // Determine the base path for the <base> tag
    let requestPath = new URL(fullTargetUrl).pathname;
    // Ensure the base path ends with a slash if it's a directory-like path
    if (!requestPath.endsWith('/')) {
        requestPath = requestPath.substring(0, requestPath.lastIndexOf('/') + 1);
    }
    const baseHref = `/api/epic-proxy${requestPath}`;

    // Inject the <base> tag into the <head>
    const baseTag = `<base href="${baseHref}">`;
    if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}`);
    } else if (html.match(/<head\s*>/i)) { // handle <head> with different spacing
        html = html.replace(/(<head[^>]*>)/i, `$1${baseTag}`);
    }
    else {
        // Fallback if no <head> tag
        html = baseTag + html;
    }

    // Rewrite any absolute paths to go through the proxy, but only if they haven't been rewritten already.
    // The <base> tag does not affect URLs starting with a '/'.
    html = html.replace(/(href|src|action)="\/(?!api\/)/g, `$1="/api/epic-proxy/`);

    // Rewrite srcset as well, ensuring not to double-prefix.
    html = html.replace(/(srcset)="([^"]*)"/g, (match, attr, value) => {
      const newSources = value.split(',').map(source => {
        const parts = source.trim().split(/\s+/);
        const url = parts[0];
        const descriptor = parts.slice(1).join(' ');
        // Only prepend proxy path if it's an absolute path AND not already proxied
        if (url.startsWith('/') && !url.startsWith('/api/')) {
          return `/api/epic-proxy${url} ${descriptor || ''}`;
        }
        return source;
      }).join(', ');
      return `${attr}="${newSources}"`;
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Frame-Options', 'ALLOWALL');

    return res.status(response.status).send(html);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).send('Proxy error');
  }
}
