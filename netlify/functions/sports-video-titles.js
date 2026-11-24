// Public YouTube titles for the two Block Light Media sports films.
// Server-side oEmbed avoids browser CORS restrictions. No user-controlled URLs.
const VIDEO_IDS = Object.freeze(['e0OlvGDY9kU', 'Jjasc2D598k']);
const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=900, s-maxage=3600',
    'X-Content-Type-Options': 'nosniff'
  },
  body: JSON.stringify(payload)
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { ...json(405, { error: 'Method not allowed' }), headers: { 'Content-Type': 'application/json', Allow: 'GET' } };
  }
  const pairs = await Promise.all(VIDEO_IDS.map(async (id) => {
    try {
      const endpoint = new URL('https://www.youtube.com/oembed');
      endpoint.searchParams.set('url', 'https://www.youtube.com/watch?v=' + id);
      endpoint.searchParams.set('format', 'json');
      const response = await fetch(endpoint.toString(), {
        signal: AbortSignal.timeout(4500),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) return [id, null];
      const data = await response.json();
      const title = typeof data.title === 'string' ? data.title.trim() : '';
      return [id, title && title.length <= 220 ? title : null];
    } catch {
      return [id, null];
    }
  }));
  return json(200, { titles: Object.fromEntries(pairs) });
};
