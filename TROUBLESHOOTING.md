# 🛠️ AlgoStream Troubleshooting Guide

This guide is designed to help you (or anyone taking over this project) debug and fix common issues without needing to read the entire codebase.

---

## 🔐 Authentication Issues (Google Login Failed)

**Symptoms:**
- Clicking "Continue with Google" redirects back to login immediately.
- Error message: `OAuthCallbackError` or `Try signing in with a different account`.
- Google Error Page: `400: redirect_uri_mismatch`

**Solutions:**

1.  **Authorized Redirect URI Mismatch (Most Common)**
    *   **Cause:** You deployed to a new domain (e.g., `algo-stream.vercel.app`) but Google Console only knows about the old one or `localhost`.
    *   **Fix:**
        1.  Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
        2.  Edit your **OAuth 2.0 Client ID**.
        3.  Under **Authorized redirect URIs**, add your EXACT new URL:
            *   `https://<your-new-domain>.vercel.app/api/auth/callback/google`
        4.  Save. Wait 5 minutes.

2.  **Missing Environment Variables**
    *   **Cause:** Vercel doesn't have the secrets from your local `.env.local`.
    *   **Fix:**
        1.  Go to Vercel Dashboard > Project Settings > Environment Variables.
        2.  Ensure `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` are added.
        3.  **Redeploy** (env vars only take effect on new deployment).

3.  **NEXTAUTH_URL Misconfiguration**
    *   **Cause:** NextAuth doesn't know the canonical URL of the site.
    *   **Fix:**
        *   On Vercel: Set `NEXTAUTH_URL` to `https://<your-domain>.vercel.app`.
        *   Locally: Set it to `http://localhost:3000`.

---

## 🗄️ Database Issues (MongoDB)

**Symptoms:**
- App loads but shows "Failed to fetch notes".
- Server Logs say `MongooseServerSelectionError: connect ETIMEDOUT`.

**Solutions:**

1.  **IP Address Whitelist (Most Common)**
    *   **Cause:** MongoDB Atlas firewall blocks unknown IPs. Vercel's IP changes frequently.
    *   **Fix:**
        1.  Go to [MongoDB Atlas > Network Access](https://cloud.mongodb.com/).
        2.  Add IP Address -> **Allow Access from Anywhere (0.0.0.0/0)**.
        *   *(Note: For a strict production app, you'd use VPC peering, but for Vercel hobby tier, 0.0.0.0/0 is standard pattern).*

2.  **Invalid Connection String**
    *   **Cause:** Password contains special characters (`@`, `:`, `/`) not URL-encoded.
    *   **Fix:**
        *   URL Encode your password. Example: `p@ssword` -> `p%40ssword`.

---

## 🏗️ Build & Deployment Errors

**Symptoms:**
- Vercel deployment fails with `Command "npm run build" exited with 1`.

**Solutions:**

1.  **TypeScript Errors**
    *   **Cause:** Strict type checking fails (e.g., `Property 'foo' does not exist on type 'bar'`).
    *   **Fix:**
        *   Run `npm run build` locally to see the exact error.
        *   Fix the type error in code.
        *   *Emergency/Quick Fix:* Add `// @ts-ignore` above the line (discouraged but works).

2.  **Missing Suspense Boundary (Next.js 13/14)**
    *   **Cause:** Using `useSearchParams()` in a Client Component without `<Suspense>`.
    *   **Fix:** Wrap the component in `<Suspense>` locally or in `layout.tsx`.

---

## 🐛 Debugging Tips

If you are stuck and don't know what's wrong:

1.  **Check Vercel Logs:**
    *   Dashboard > Project > Deployments > Click latest deployment > **Logs**.
    *   Look for 빨간 "Error" lines.

2.  **Enable Debug Mode:**
    *   In `lib/auth.ts`, set `debug: true` temporarily to see full OAuth handshake logs.

3.  **Run Locally:**
    *   Does it work on `localhost:3000`? If yes, it's an **Environment/Config** issue (Firewall, Redirect URI, Env Vars). If no, it's a **Code** issue.

---

### 🆘 Emergency Contact
If you hand this over to another developer, give them access to:
1.  **GitHub Repo** (Code)
2.  **Vercel Dashboard** (Deployment)
3.  **MongoDB Atlas** (Database)
4.  **Google Cloud Console** (Auth)
