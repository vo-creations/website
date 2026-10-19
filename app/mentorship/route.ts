// DECISION 2026-10: /mentorship was a creator-enrollment funnel ("Get paid
// to create content for real brands"), deleted in the agency-only redesign.
// Sending it to the homepage made Google treat an indexed URL as the agency
// page. 410 tells crawlers the URL is gone on purpose.
// See docs/DECISIONS.md (topic: seo-aeo-2026-10).

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Page removed | Vo Creations</title>
  <style>
    body { margin: 0; background: #121212; color: #f5f5f5; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    main { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 48px 24px; }
    a { color: #121212; background: #fff; text-decoration: none; font-weight: 700; border-radius: 999px; padding: 14px 28px; }
    p { color: #bdbdbd; max-width: 420px; line-height: 1.6; }
    h1 { font-size: 32px; letter-spacing: -0.03em; margin-bottom: 12px; }
  </style>
</head>
<body>
  <main>
    <h1>This page was removed.</h1>
    <p>The creator mentorship signup used to live here. Vo Creations is now the agency site.</p>
    <p><a href="https://vocreations.com/">Back to Vo Creations</a></p>
  </main>
</body>
</html>`;

const headers = {
  "content-type": "text/html; charset=utf-8",
  "x-robots-tag": "noindex",
};

export function GET() {
  return new Response(html, { status: 410, headers });
}

export function HEAD() {
  return new Response(null, { status: 410, headers });
}
