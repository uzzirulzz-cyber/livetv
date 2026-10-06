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
   - `CLOUDFLARE_API_TOKEN`: `REDACTED_CF_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`: `20c83732a1af52f80655768cd4dfc251`

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
   - **Build command**: `npm run build`
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

- **Free-to-air channels**: a curated catalog of channels their owners provide free (Free-TV list), in `src/data/freeChannels.ts`.
- **Lag-Free Edge Proxy**: Video TS segments and HLS M3U8 playlists are dynamically proxied and cached using Cloudflare Workers.
- **Admin suite**: manage lines, playlists and credits at `/admin`. Set credentials outside the repo.
