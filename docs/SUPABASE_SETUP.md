# Optional accounts (Supabase, free plan)

echo works with no account. Sign-in appears in Profile only after both `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set on the server. If either one is missing, `/api/supabase-config` answers `{ "enabled": false }` and the sign-in block stays hidden. The anon key is not stored in this repo.

The project to use:

- URL: `https://nomtmlidkuhkllniaytu.supabase.co`
- Project ref: `nomtmlidkuhkllniaytu`
- Plan: Free

## 1. Run the migration

In the Supabase dashboard, open SQL Editor and run the whole file:

`supabase/migrations/0001_listening_history.sql`

That creates four tables (`listening_history`, `bookmarks`, `resume_state`, `breath_streak`). Each row has `user_id` pointing at `auth.users`. Row Level Security is on and forced. The `anon` and `public` roles have no access. The `authenticated` role can select, insert, update, and delete only rows where `user_id = auth.uid()`. There is no public read.

## 2. Turn on sign-in

Authentication, then Providers.

- Google: on. In Google Cloud, create an OAuth client (the Google Cloud free tier is enough). Authorized redirect URI: `https://nomtmlidkuhkllniaytu.supabase.co/auth/v1/callback`. Copy the client id and secret into the Supabase Google provider. The app uses a full-page redirect, not a popup.
- Email: on, so a person can request a magic link. Leave passwords off. The app has no password field.

Authentication, then URL configuration.

- Site URL: `https://www.echo11.space`
- Redirect URLs:
  - `https://www.echo11.space/**`
  - `https://echo11.space/**`
  - `https://*-shira-sarids-projects.vercel.app/**`
  - `http://127.0.0.1:8765/**` (only if you try sign-in on a local server)
  - `http://localhost:3000/**`

If the dashboard rejects the wildcard, add the exact preview URL instead.

## 3. Vercel environment variables

Add these for Production and Preview. Do not commit them.

| Name | Where it is read | Value |
| --- | --- | --- |
| `SUPABASE_URL` | server, `/api/supabase-config` | `https://nomtmlidkuhkllniaytu.supabase.co` |
| `SUPABASE_ANON_KEY` | server, then sent to the browser as the public anon key | Project Settings, API, the `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only, `/api/delete-account` | Project Settings, API, the `service_role` key |

`SUPABASE_SERVICE_ROLE_KEY` never goes to the browser and is not in the config route. It is what lets "Delete my account and history" remove the auth user. The listening rows are removed first with the person's own token, under Row Level Security. If the service role key is not set yet, those rows are still removed and the device is cleared, and the route answers `server_key_missing`. The auth user then remains until the key is added or you delete the user in the Supabase dashboard.

Redeploy after saving the variables. A deploy with the variables missing is safe: guests keep the app they have today.

## 4. What the free plan does not include

Nothing in this change needs a paid Supabase tier. Do not turn on Point-in-Time Recovery, read replicas, log drains, branching, or SAML SSO.

Google sign-in and email magic links are part of the free plan. The built-in Supabase mailer is only for trying the link: it is rate limited, and Supabase may deliver those messages only to addresses already on the project until you connect your own SMTP server. Your own SMTP is optional. It is not a paid Supabase add-on, and this setup does not add one.
