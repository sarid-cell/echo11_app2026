/* POST /api/license — same-origin proxy to the Lemon Squeezy License API.

   Lemon Squeezy doesn't document CORS for /v1/licenses/*, so the browser
   talks to this function instead of api.lemonsqueezy.com. The activate and
   validate endpoints are public by design — no API key or secret is used.

   Body (JSON): { action: 'activate' | 'validate', license_key,
                  instance_name (activate), instance_id (validate) }
   Reply:       { activated, valid, error, status, instance_id }
   Only these fields go back to the browser; the buyer's name and email in
   Lemon Squeezy's `meta` never leave the server.

   Optional env vars LEMONSQUEEZY_STORE_ID / LEMONSQUEEZY_PRODUCT_ID restrict
   activation to keys sold for echo·11 (not set = any Lemon Squeezy key). */
const LS = 'https://api.lemonsqueezy.com/v1/licenses/';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  const action = body.action;
  const key = String(body.license_key || '').trim().slice(0, 100);
  if ((action !== 'activate' && action !== 'validate') || !key) {
    return res.status(400).json({ activated: false, valid: false, error: 'Missing license key.' });
  }

  const form = new URLSearchParams({ license_key: key });
  if (action === 'activate') form.set('instance_name', String(body.instance_name || 'echo11.space').slice(0, 100));
  if (action === 'validate' && body.instance_id) form.set('instance_id', String(body.instance_id).slice(0, 100));

  let r, j;
  try {
    r = await fetch(LS + action, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });
    j = await r.json();
  } catch (e) {
    return res.status(502).json({ activated: false, valid: false, error: 'License server unreachable.' });
  }

  const meta = j.meta || {}, lk = j.license_key || {};
  const store = process.env.LEMONSQUEEZY_STORE_ID, product = process.env.LEMONSQUEEZY_PRODUCT_ID;
  if ((j.activated || j.valid) &&
      ((store && String(meta.store_id) !== String(store)) || (product && String(meta.product_id) !== String(product)))) {
    return res.status(403).json({ activated: false, valid: false, error: 'This key belongs to a different product.' });
  }

  return res.status(r.ok ? 200 : r.status).json({
    activated: j.activated === true,
    valid: j.valid === true,
    error: j.error || null,
    status: lk.status || null,
    instance_id: (j.instance && j.instance.id) || null
  });
};
