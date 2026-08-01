# Deploy FoodHub to Oracle Cloud Always-Free (ARM VM)

Free forever, always-on, no cold start. Runs the **existing code unchanged**:
MongoDB + Node API (port 5000) + the built client with its `/api` proxy (port 80)
all on one VM.

## 1. Create the Oracle Cloud account (free)

1. Go to https://signup.cloud.oracle.com → fill in details.
2. Oracle **requires card verification** — it will **not** charge you; it may hold ~$1
   temporarily for verification (refunded).
3. Sign in to https://cloud.oracle.com → pick a Home Region (nearest you).

> The Always-Free tier has no monthly cost and never expires. The account is capped —
> don't upgrade to "Pay As You Go" (that's billable).

## 2. Create the Always-Free ARM VM

1. **Compute → Instances → Create instance**.
2. Name: `foodhub` (anything).
3. **Image**: Ubuntu — pick **Canonical Ubuntu 24.04 (or 22.04)**, choose **Minimal**
   to save resources if offered.
4. **Shape**: click *Change shape* → **Ampere → VM.Standard.A1.Flex** (ARM).
   - Set **4 OCPU + 24 GB RAM** (full Always-Free allowance) — this app runs comfortably.
5. **Add SSH keys**: choose *Generate a key pair* → download both **private** (keep safe,
   used to SSH) and public, or upload your own public key.
6. **Boot volume**: default (min 47 GB) — free tier includes 200 GB total.
7. Click **Create**.

## 3. Open the firewall (security list)

Networking → **Virtual cloud networks → the VCN of the instance → Security Lists → Default Security List → Add Ingress Rules**, add:

| Source | Protocol | Port | Purpose |
|--------|----------|------|---------|
| `0.0.0.0/0` | TCP | 22 | SSH |
| `0.0.0.0/0` | TCP | 80 | Web (client + API proxy) |
| `0.0.0.0/0` | TCP | 5000 | Direct API (optional) |

## 4. Run the setup script

From your computer (replace `<public-ip>` with the instance's public IP):

```bash
ssh -i <your-private-key.pem> ubuntu@<public-ip>
```

Then inside the VM:

```bash
sudo curl -fsSL -o /tmp/setup.sh \
  https://raw.githubusercontent.com/Kahprx/foodhub/main/deploy/oracle/setup.sh
sudo bash /tmp/setup.sh "http://<public-ip>"
```

Wait ~5–10 minutes (installs Node 22 + MongoDB 8, builds the client, starts both services).
At the end it prints the health check and URL.

> To attach a domain later, rerun nothing — just update `CLIENT_URL` in
> `/opt/foodhub/server/.env`, point DNS A-record to the IP, and
> `sudo systemctl restart foodhub-api`.

## 5. Verify

- Open `http://<public-ip>/` → the store loads.
- `http://<public-ip>/api/v1/health` → `{"success":true,...}`.
- Login: `admin@happyhomes.com` / `admin123` (admin), `user@happyhomes.com` / `user123`.

## 6. Useful commands on the VM

```bash
systemctl status foodhub-api foodhub-client
journalctl -u foodhub-api -f     # API logs
journalctl -u foodhub-client -f  # client logs
systemctl restart foodhub-api foodhub-client
```

The API auto-seeds demo data on first boot when the database is empty. To reset:
`sudo systemctl stop foodhub-api && sudo rm -rf /var/lib/mongodb/* && sudo systemctl restart mongod foodhub-api`.

## 7. (Optional) Migrate existing data from Railway MongoDB

See [`migrate-data.md`](./migrate-data.md). For a fresh demo start you don't need it —
the VM seeds its own data automatically.

## 8. (Optional) Free monitoring + HTTPS

- **UptimeRobot** (free): monitor `http://<public-ip>/api/v1/health` every 5 min.
- **Cloudflare** (free): put the site behind a free domain/HTTPS once you have a domain.
