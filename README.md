# PlayBeat Live — Entertainment Without Limits

> **Live Production Domain:** [https://playbeat.live](https://playbeat.live)  
> **Edge Worker Gateway:** [https://playbeat-live.playbeatdigital.workers.dev](https://playbeat-live.playbeatdigital.workers.dev)  
> **Status:** Active, Proxied, and SSL Secured on Cloudflare Edge

---

## 🚀 Connect GitHub to Cloudflare & Go Live

### Option A: Automatic Deployment via GitHub Actions (Recommended)
This repository includes a preconfigured GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. **Push your code to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/playbeat-live.git
   git push -u origin main
   ```

2. **Add GitHub Repository Secrets**:
   Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:
   - `CLOUDFLARE_API_TOKEN`: a newly issued token scoped to deploy the required Worker.
   - `CLOUDFLARE_ACCOUNT_ID`: your Cloudflare account ID.

   Do not put tokens or provider credentials in source files. Rotate any credentials that were previously committed.

3. **Publish to Go Live**:
   Every time you push commits to `main`, GitHub Actions will automatically:
   - Install dependencies and build the Vite frontend
   - Apply pending `playbeat-catalog` D1 migrations
   - Deploy assets and the edge proxy worker to Cloudflare
   - Update `https://playbeat.live` instantly with 0 downtime!

---

### Option B: Direct Cloudflare Dashboard Git Connection

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) and select the account configured for this deployment.
2. Navigate to **Compute (Workers) > Workers & Pages**.
3. Click **Create Application** -> Select **Pages** or **Workers** -> **Connect to Git**.
4. Authenticate your GitHub account and select your `playbeat-live` repository.
5. Set Build Settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**. Cloudflare will continuously deploy your commits!

---

## 🌐 Cloudflare DNS & Nameservers

The Wrangler configuration routes `playbeat.live/*` to the `playbeat-live` Worker when deployed. This Worker serves the built SPA assets and API requests. Existing proxied DNS records are retained; do not replace them with guessed IPs or convert the apex to a Worker custom domain. The zone must be active on Cloudflare and proxied for Worker routes to run. Nameserver delegation and SSL mode remain zone-level settings and should be checked in Cloudflare.

---

## ⚡ Architecture & Features

- **Provider-fed Live TV**: No demonstration/test channels are advertised as live. Channels load only when an authorized HTTPS provider is configured.
- **D1 Catalog Storage**: `CATALOG_DB` stores channel metadata without upstream stream URLs or provider credentials. The `epg_programs` schema is installed, but XMLTV ingestion is not implemented.
- **Stream Proxy**: The Worker proxies provider playlists and segments when the provider is configured to use HTTPS.
- **Admin Suite**: `/admin` validates the `ADMIN_TOKEN` Worker secret on the server. Set a strong random value as a Cloudflare Worker secret before signing in; the browser keeps it in memory only and clears it on sign-out or reload. Never commit or share the token.

### Live catalog and D1 setup

The Worker is bound to the `playbeat-catalog` D1 database in [`wrangler.toml`](./wrangler.toml), and the initial schema is in [`migrations/0001_catalog.sql`](./migrations/0001_catalog.sql). Deployments apply pending migrations before publishing the Worker.

Set `GEOTV_HOST` to an HTTPS endpoint and configure `GEOTV_USER` and `GEOTV_PASS` as Cloudflare Worker secrets. The Worker rejects HTTP provider endpoints because they would expose credentials in transit. Do not put provider credentials in browser code, query strings, or D1. No provider credentials are currently configured in this repository; until a rotated, authorized HTTPS endpoint is configured, the live catalog and playback remain unavailable.

### Admin sign-in

In Cloudflare Dashboard, open **Workers & Pages → `playbeat-live` → Settings → Variables and Secrets**. Add `ADMIN_TOKEN` as a secret with a strong, randomly generated value. After deploying, open `/admin` and enter that same value to sign in. The token is validated by the Worker and held only in page memory; sign out or reload to clear it.
