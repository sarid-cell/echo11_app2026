/* POST /api/delete-account
   Authorization: Bearer <user access token>
   Deletes that auth user with SUPABASE_SERVICE_ROLE_KEY, which stays on the server.
   Rows in the listening tables go with the user (on delete cascade).
   If the server key is not set, history rows can still be removed by the browser
   under Row Level Security, and this route says server_key_missing. */
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, reason: 'method' });
  }
  var url = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
  var anon = String(process.env.SUPABASE_ANON_KEY || '').trim();
  var service = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !anon) return res.status(200).json({ ok: false, reason: 'not_configured' });

  var header = req.headers.authorization || '';
  var token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ ok: false, reason: 'missing_token' });

  var userRes;
  try {
    userRes = await fetch(url + '/auth/v1/user', {
      headers: { Authorization: 'Bearer ' + token, apikey: anon }
    });
  } catch (e) {
    return res.status(502).json({ ok: false, reason: 'unreachable' });
  }
  if (!userRes.ok) return res.status(401).json({ ok: false, reason: 'bad_token' });
  var user = await userRes.json().catch(function () { return {}; });
  if (!user.id) return res.status(401).json({ ok: false, reason: 'bad_token' });

  if (!service) return res.status(200).json({ ok: false, reason: 'server_key_missing' });

  var del;
  try {
    del = await fetch(url + '/auth/v1/admin/users/' + encodeURIComponent(user.id), {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + service, apikey: service }
    });
  } catch (e) {
    return res.status(502).json({ ok: false, reason: 'unreachable' });
  }
  if (!del.ok) return res.status(502).json({ ok: false, reason: 'delete_failed' });
  return res.status(200).json({ ok: true });
};
