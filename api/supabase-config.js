/* GET /api/supabase-config
   Returns the public project URL and the anon key, or { enabled: false }.
   SUPABASE_SERVICE_ROLE_KEY is never read here. */
module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ enabled: false, error: 'Method not allowed.' });
  }
  var url = String(process.env.SUPABASE_URL || '').trim();
  var anonKey = String(process.env.SUPABASE_ANON_KEY || '').trim();
  if (!url || !anonKey) return res.status(200).json({ enabled: false });
  return res.status(200).json({ enabled: true, url: url, anonKey: anonKey });
};
