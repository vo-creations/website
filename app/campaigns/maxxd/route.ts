// DECISION 2026-10: the public Maxxd campaign page named a client and
// shipped campaign figures. It now returns 410. See docs/DECISIONS.md
// (topic: site-audit-pass-2).

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Page removed | Vo Creations</title>
  <style>
    body { margin: 0; background: #060606; color: #f5f5f3; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    main { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 48px 24px; }
    a { color: #060606; background: #fff; text-decoration: none; font-weight: 700; border-radius: 999px; padding: 14px 28px; }
    p { color: #c4c4c0; max-width: 440px; line-height: 1.6; font-size: 16px; }
    h1 { font-size: 32px; letter-spacing: -0.03em; margin-bottom: 12px; }
  </style>
</head>
<body>
  <main>
    <h1>This page was removed.</h1>
    <p>Campaign results stay on a call. The public write-up that used to live here is gone.</p>
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
