#!/usr/bin/env bash
#
# FoodHub — one-shot server setup for an Oracle Cloud Always-Free ARM VM (Ubuntu 22.04/24.04)
#
#   Installs: Node.js 22, MongoDB 8.0, clones the repo, builds the client,
#             creates systemd services (API :5000, Client :80), opens the firewall.
#
#   The API auto-seeds demo data on first boot when the DB is empty.
#
# Usage:
#   sudo bash setup.sh [APP_URL]
#
#   APP_URL        optional; e.g. http://123.123.123.123  or  https://foodhub.example.com
#                  If omitted, the script tries to detect the VM public IP.
#
#   Env overrides (optional):
#     GIT_REPO     repo to clone          (default: https://github.com/Kahprx/foodhub.git)
#     GIT_BRANCH   branch to checkout     (default: main)
#     APP_DIR      install directory      (default: /opt/foodhub)
#     SMTP_USER / SMTP_PASS / SMTP_HOST / SMTP_PORT / SMTP_SECURE
#     CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
#     STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET
#     VNPAY_TMN_CODE / VNPAY_HASH_SECRET / VNPAY_URL
#     MOMO_PARTNER_CODE / MOMO_ACCESS_KEY / MOMO_SECRET_KEY

set -euo pipefail

GIT_REPO="${GIT_REPO:-https://github.com/Kahprx/foodhub.git}"
GIT_BRANCH="${GIT_BRANCH:-main}"
APP_DIR="${APP_DIR:-/opt/foodhub}"
APP_URL="${1:-}"
API_PORT=5000
CLIENT_PORT=80

log()  { echo -e "\n\033[1;32m[foodhub]\033[0m $*"; }
fail() { echo -e "\n\033[1;31m[fail]\033[0m $*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || fail "Run as root: sudo bash setup.sh [APP_URL]"

log "=== 1/7 System packages ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends \
  curl ca-certificates gnupg lsb-release git build-essential \
  openssl ufw

# --- Node.js 22 LTS (NodeSource) ---
if ! command -v node >/dev/null 2>&1 || [ "$(node -r process -e 'process.stdout.write(process.versions.node.split(".")[0])')" -lt 22 ]; then
  log "Installing Node.js 22 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y nodejs
fi
node -v
npm -v

# --- MongoDB Community 8.0 ---
if ! command -v mongod >/dev/null 2>&1; then
  log "Installing MongoDB 8.0..."
  . /etc/os-release
  case "$VERSION_ID" in
    24.04) MONGO_DISTRO="ubuntu2404" ;;
    22.04) MONGO_DISTRO="ubuntu2204" ;;
    *)     fail "Unsupported Ubuntu version ($VERSION_ID); edit the MONGO_DISTRO line manually." ;;
  esac
  curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc \
    | gpg --dearmor --yes -o /usr/share/keyrings/mongodb-server-8.0.gpg
  echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${MONGO_DISTRO}/mongodb-org/8.0 multiverse" \
    > /etc/apt/sources.list.d/mongodb-org-8.0.list
  apt-get update -y
  apt-get install -y mongodb-org
fi
systemctl enable --now mongod
sleep 2
mongod --version | head -1

log "=== 2/7 Clone repo -> $APP_DIR ==="
mkdir -p "$APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone --depth 1 --branch "$GIT_BRANCH" "$GIT_REPO" "$APP_DIR"
else
  git -C "$APP_DIR" fetch origin
  git -C "$APP_DIR" reset --hard "origin/$GIT_BRANCH"
fi

# --- Detect public URL if not given ---
if [ -z "$APP_URL" ]; then
  PUBLIC_IP="$(curl -4 -fsSL --max-time 10 https://ifconfig.me 2>/dev/null || true)"
  APP_URL="http://${PUBLIC_IP:-YOUR_PUBLIC_IP}"
fi

log "=== 3/7 Backend install + .env ==="
SERVER_DIR="$APP_DIR/server"
npm install --prefix "$SERVER_DIR" --omit=dev

JWT_SECRET="$(openssl rand -hex 32)"
JWT_REFRESH_SECRET="$(openssl rand -hex 32)"
{
  echo "PORT=$API_PORT"
  echo "MONGODB_URI=mongodb://127.0.0.1:27017/foodhub"
  echo "JWT_SECRET=$JWT_SECRET"
  echo "JWT_EXPIRES_IN=7d"
  echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"
  echo "CLIENT_URL=$APP_URL"
  echo "SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}"
  echo "SMTP_PORT=${SMTP_PORT:-587}"
  echo "SMTP_SECURE=${SMTP_SECURE:-false}"
  echo "SMTP_USER=${SMTP_USER:-}"
  echo "SMTP_PASS=${SMTP_PASS:-}"
  echo "CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME:-}"
  echo "CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY:-}"
  echo "CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET:-}"
  echo "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}"
  echo "STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-}"
  echo "VNPAY_TMN_CODE=${VNPAY_TMN_CODE:-}"
  echo "VNPAY_HASH_SECRET=${VNPAY_HASH_SECRET:-}"
  echo "VNPAY_URL=${VNPAY_URL:-https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}"
  echo "MOMO_PARTNER_CODE=${MOMO_PARTNER_CODE:-}"
  echo "MOMO_ACCESS_KEY=${MOMO_ACCESS_KEY:-}"
  echo "MOMO_SECRET_KEY=${MOMO_SECRET_KEY:-}"
} > "$SERVER_DIR/.env"
chmod 600 "$SERVER_DIR/.env"
echo "CLIENT_URL=$APP_URL  (edit $SERVER_DIR/.env to change later)"

log "=== 4/7 Client install + build ==="
CLIENT_DIR="$APP_DIR/client/food_UI"
npm install --prefix "$CLIENT_DIR"
npm run build --prefix "$CLIENT_DIR"

log "=== 5/7 systemd services ==="
# --- foodhub-api ---
cat > /etc/systemd/system/foodhub-api.service <<EOF
[Unit]
Description=FoodHub API
After=network.target mongod.service
Wants=mongod.service

[Service]
Type=simple
WorkingDirectory=$SERVER_DIR
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# --- foodhub-client (static + /api proxy, port 80) ---
cat > /etc/systemd/system/foodhub-client.service <<EOF
[Unit]
Description=FoodHub Client (SPA + proxy)
After=network.target foodhub-api.service

[Service]
Type=simple
WorkingDirectory=$CLIENT_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=$CLIENT_PORT
Environment=BACKEND_URL=http://127.0.0.1:$API_PORT

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now foodhub-api
systemctl enable --now foodhub-client

log "=== 6/7 Firewall ==="
ufw --force reset >/dev/null
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 5000/tcp
ufw --force enable

log "=== 7/7 Wait for API + seed ==="
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$API_PORT/api/v1/health" 2>/dev/null; then break; fi
  sleep 2
done
curl -fsS "http://127.0.0.1:$API_PORT/api/v1/health" || fail "API not healthy yet — check: journalctl -u foodhub-api"

log "Health check (via client proxy on :$CLIENT_PORT):"
curl -fsS "http://127.0.0.1:$CLIENT_PORT/api/v1/health"
echo
log "DONE. Open:  $APP_URL"
log "Logs: journalctl -u foodhub-api -f   |   journalctl -u foodhub-client -f"
log "Restart: systemctl restart foodhub-api foodhub-client"
log "Seed accounts: admin@happyhomes.com/admin123, user@happyhomes.com/user123, store@happyhomes.com/store123"
