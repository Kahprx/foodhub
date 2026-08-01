# Migrate data from Railway MongoDB → Oracle VM (optional)

Only needed if you want to keep existing production data (orders, registered users, ...).
For a fresh demo start, skip this — the API auto-seeds demo data on an empty DB.

## On your computer

1. Open a tunnel to the Railway MongoDB (from the `foodhub` repo dir, with Railway CLI logged in):

   ```bash
   railway connect MongoDB --tunnel-only -e production
   ```

   It prints a local address like `mongodb://localhost:PORT` — note the port.

2. Dump the database (using the tunnel address). MongoDB tools are required:
   https://www.mongodb.com/try/download/database-tools

   ```bash
   mongodump --uri "mongodb://localhost:PORT" --db foodhub --out ./foodhub-dump
   ```

3. Copy the dump to the VM:

   ```bash
   scp -i <your-private-key.pem> -r ./foodhub-dump ubuntu@<public-ip>:~
   ```

## On the VM

```bash
mongorestore --uri "mongodb://127.0.0.1:27017" --db foodhub --drop ~/foodhub-dump/foodhub
sudo systemctl restart foodhub-api
```

Verify a seeded user still logs in before doing anything else.
