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
   - Deploy assets and the edge proxy worker to Cloudflare
   - Update `https://playbeat.live` instantly with 0 downtime!

---

### Option B: Direct Cloudflare Dashboard Git Connection

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) and select account: **Playbeatdigital@gmail.com's Account** (`20c83732a1af52f80655768cd4dfc251`).
2. Navigate to **Compute (Workers) > Workers & Pages**.
3. Click **Create Application** -> Select **Pages** or **Workers** -> **Connect to Git**.
4. Authenticate your GitHub account and select your `playbeat-live` repository.
5. Set Build Settings:
   - **Framework preset**: Vite
   - **Build command**: `bun run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**. Cloudflare will continuously deploy your commits!

---

## 🌐 Cloudflare DNS & Nameservers Configuration

The domain `playbeat.live` is active on Cloudflare with the following name servers:
- **Primary NS**: `anirban.ns.cloudflare.com`
- **Secondary NS**: `nancy.ns.cloudflare.com`

### Active DNS Records:
| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | `@` (playbeat.live) | `104.21.68.14` | Proxied (Orange Cloud) | Auto |
| CNAME | `www` | `playbeat.live` | Proxied (Orange Cloud) | Auto |
| Worker Domain | `playbeat.live` | Worker `playbeat-live` | Proxied | Auto |
| Worker Domain | `www.playbeat.live` | Worker `playbeat-live` | Proxied | Auto |

---

## ⚡ Architecture & Features

- **850+ Live Channels**: 100% free streaming directly from `playbeat.live`.
- **Lag-Free Edge Proxy**: Video TS segments and HLS M3U8 playlists are dynamically proxied and cached using Cloudflare Workers.
- **DNS-over-HTTPS (DoH)**: Integrates Cloudflare `1.1.1.1` DoH to bypass ISP streaming blocks and throttle.
- **Full Reseller & Admin Suite**: Manage lines, playlists, credits, and Cloudflare telemetry at `/admin` (credentials: `admin@playbeat.digital` / `playbeat1122`).
