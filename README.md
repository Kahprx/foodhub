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

## Deploy on Railway

Two services, one repo:

**1. Backend (`server/`)**
- Root Directory: `server/`
- Start command: `npm start` (auto via `server/railway.json`)
- Required env vars: `PORT` (auto), `MONGODB_URI` (Railway MongoDB or Atlas), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (your frontend URL)
- Optional: `SMTP_*`, `CLOUDINARY_*`, `VNPAY_*`, `MOMO_*`, `STRIPE_*`

**2. Frontend (`client/food_UI/`)**
- Root Directory: `client/food_UI/`
- Build: `npm run build`, Start: `npm start` (Express static server, auto via `client/food_UI/railway.json`)
- Env var: `BACKEND_URL` = your backend Railway URL (e.g. `https://foodhub-server-production.up.railway.app`)
- The Express server serves the built SPA and proxies `/api/*` to `BACKEND_URL` — no build-time `VITE_API_URL` needed.
- Optional: set `VITE_API_URL` at build time to override the API base directly.

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
