# 🧸 HAPPYHOMES — TOYLAND E-commerce

Full-stack premium toy e-commerce platform: React 19 client + Express/MongoDB API.

## Tech Stack

**Frontend** (`client/food_UI`)
- React 19 + Vite 8, Tailwind CSS 4
- React Router 7, framer-motion, recharts, react-icons, react-toastify
- UI bits: BorderGlow, SpecularButton, CurvedInput, Lightfall, LineSidebar, TiltedCard, MagicBento

**Backend** (`server`)
- Express 5, Mongoose 9, JWT auth + refresh tokens
- helmet, express-rate-limit, swagger (`/api-docs`)
- exceljs (order export), pdfkit (order PDF), cloudinary + multer (upload)
- nodemailer (verify / reset password / order status emails)

## Getting Started

Prereq: Node 18+, MongoDB running at `mongodb://127.0.0.1:27017/foodhub`.

```bash
# 1. Install
npm install
npm install --prefix server
npm install --prefix client/food_UI

# 2. Config
cp server/.env.example server/.env   # fill MongoDB URI, JWT secrets, SMTP, payment keys

# 3. Seed database
npm run seed --prefix server
# 4. Run
npm start --prefix server            # API on http://localhost:5000
npm run dev --prefix client/food_UI  # UI on http://localhost:5173
```

### Seed accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@happyhomes.com | admin123 |
| Customer | user@happyhomes.com | user123 |
| Restaurant | store@happyhomes.com | store123 |

## Features

**Customer**
- Home: hero, flash sale (on-sale products) with countdown, featured/new/best-seller rows, newsletter
- Menu: search (with history), category chips + filters, price range, rating, sort, pagination / infinite scroll, grid / list view, quick view, compare
- Product detail: multi-image gallery + zoom, discount price, reviews, related products, recently viewed
- Cart: quantity, coupon (percent / fixed), shipping fee, discount totals
- Checkout: saved addresses, shipping provider (SPX / GHN / Viettel Post), COD / VNPay / MoMo / Stripe
- Orders: list + detail with status timeline, tracking number / ETA
- Profile: edit personal info, manage saved addresses
- Wishlist, payment result page, mobile bottom navigation

**Admin** (`/admin`)
- Dashboard: revenue (today / week / month), orders, users, low stock, top selling, top customers, top brands, conversion analytics, revenue & status charts, recent orders
- Manage foods (Excel import/export, stock logs), orders (status + shipping tracking, Excel/PDF export), users (soft delete / restore / role), reviews, coupons, banners, categories, brands, settings

**API / Infra**
- JWT auth + refresh rotation, role guards, rate limiting, helmet
- Newsletter subscribers endpoint
- SEO: `/robots.txt`, `/sitemap.xml` (dynamic)
- Swagger docs at `/api-docs`

## API Overview

Base URL: `http://localhost:5000/api/v1`

| Area | Routes |
|------|--------|
| Auth | `/auth/*` register, login, profile, favorites, recently-viewed, addresses, change-password, verify email, reset password, notifications |
| Foods | `/foods/*` list/filter/sort/onSale, detail, recommendations, Excel export/import |
| Cart | `/cart` GET/POST/PUT/DELETE |
| Orders | `/orders/*` create, my orders, detail, status, cancel, shipping, coupon check, revenue, exports |
| Payment | `/payment/vnpay/*`, `/payment/momo/*`, `/payment/stripe/*`, webhook |
| Dashboard | `/dashboard` stats, top-selling, top-customers, low-stock, top-brands, conversion, analytics |
| Subscribers | `/subscribers` subscribe / unsubscribe / admin list |
| Admin CRUD | `/foods`, `/categories`, `/brands`, `/banners`, `/coupons`, `/reviews`, `/users`, `/settings` |

## Environment Variables

See `server/.env.example`. Key groups:

- `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `CLIENT_URL`
- `SMTP_*` — email delivery (optional, falls back silently; forgot-password returns the reset link in dev mode when unset)
- `CLOUDINARY_*` — image upload (optional, falls back to base64 data URLs)
- `VNPAY_TMN_CODE` / `VNPAY_HASH_SECRET` / `VNPAY_URL` — VNPay
- `MOMO_PARTNER_CODE` / `MOMO_ACCESS_KEY` / `MOMO_SECRET_KEY` — MoMo
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe (falls back to graceful error if unset)

## Production

> **Migrating to a fully-free host.** The current Railway deployment works (below) but is on a
> **trial that expires** and will then stop unless paid. Migration target: **Oracle Cloud
> Always-Free ARM VM** — see [`deploy/oracle/README.md`](deploy/oracle/README.md) for the step-by-step
> guide + one-command `setup.sh`. Until the VM is live, Railway keeps serving the site.

### Current stack (Railway — deployed & verified)

**Single service** (project `marvelous-creation`, env `production`): the backend Express app serves
both the API and the built SPA (`client/food_UI/dist`). No separate frontend service, no proxy hop.

| Resource | URL |
|----------|-----|
| App (SPA + API, same origin) | https://marvelous-creation-production-5d43.up.railway.app |
| API health | https://marvelous-creation-production-5d43.up.railway.app/api/v1/health |
| Swagger docs | https://marvelous-creation-production-5d43.up.railway.app/api-docs |
| MongoDB (Railway, internal) | `mongodb.railway.internal` |

**Cold start:** none. `Serverless`/App-Sleeping is disabled on all services (`sleepApplication = false`),
so services run continuously. The backend also keeps an active MongoDB connection, which prevents
sleep even if Serverless were enabled. No keep-alive pinger is required.

**Verified end-to-end (2026-08-01):** admin + customer login, food list, add-to-cart/get-cart
(stock/isAvailable/discountPrice fields), forgot-password returns a `resetLink` on the client URL.

### ⚠️ Billing / handover note

- Workspace is on the **Trial plan with a one-time $5 credit (19 days left as of 2026-08-01)**.
  When the trial ends, deployments stop unless you upgrade.
- Current usage ≈ **$0.64 / 12 days (~$1.6/month)** — MongoDB is ~80% of the cost. The app is a
  single service now, so after the trial the **Free plan ($1 credit/month, no credit card)** covers
  roughly 3 of every 4 weeks; the rest of the month Railway pauses the services automatically and
  resumes them next cycle. Data is never lost.
- Fully-free options for the future: **Oracle Cloud Always-Free VM** (needs a card once to verify,
  then free forever — see `deploy/oracle/`), or pay **Hobby ($5/month)** for 100% uptime.
- Optional (free) alerting: add an UptimeRobot monitor (HTTP(s), 5 min) — not needed for keep-alive,
  only if you want down-notifications.

### Environment variables (currently set on Railway)

Backend: `MONGODB_URI` (Railway MongoDB, internal), `JWT_SECRET`, `JWT_REFRESH_SECRET`,
`JWT_EXPIRES_IN=7d`, `CLIENT_URL=https://marvelous-creation-production-5d43.up.railway.app`,
`SMTP_HOST/PORT/SECURE/USER/PASS` (Gmail — SMTP is unreachable from Railway, so forgot-password
safely falls back to returning the reset link).

### Redeploy after code change

```bash
railway up . --path-as-root -s marvelous-creation -e production
```

`.github/workflows/smoke-test.yml` pings the app + API on every push and daily, so a broken
deploy shows a red check on the latest commit.

## Deploy on Railway (from scratch)

One service, one repo (monorepo, deploy from repo root):

**Single service**
- Root Directory: `./` (repo root, auto via root `railway.json` — Nixpacks)
- Build: `npm run build` (installs backend + frontend deps, then `vite build` into `client/food_UI/dist`)
- Start: `npm start` (runs the Express backend, which also serves the built SPA)
- Required env vars: `PORT` (auto), `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (your app URL)
- Optional: `SMTP_*`, `CLOUDINARY_*`, `VNPAY_*`, `MOMO_*`, `STRIPE_*`

> For local development the two services are still separate: `npm run dev --prefix server` (API on
> :5000) + `npm run dev --prefix client/food_UI` (Vite on :5173, proxies `/api` to :5000). The client's
> standalone `server.js` + `client/food_UI/railway.json` only matter if you ever split them again.
>
> Image uploads: with `CLOUDINARY_*` set, files upload to Cloudinary; otherwise they are stored as base64 data URLs (fine for small files, not recommended for production).

## Project Structure

```
foodhub/
├── server/src/
│   ├── controllers/  services/  models/  routes/
│   ├── middlewares/   utils/    config/
│   ├── app.js  server.js  seed.js  swagger.js
├── client/food_UI/src/
│   ├── pages/        (Home, Menu, Cart, Checkout, Orders, OrderDetail, Profile, ...)
│   ├── pages/admin/  (Dashboard, Foods, Orders, OrderDetail, Users, ...)
│   ├── components/   (FoodCard, FoodList, Navbar, Footer, bits/*, admin/*)
│   ├── context/      (Auth, Cart, Wishlist)
│   ├── layouts/  services/  main.jsx  App.jsx
```
