# Pizzara Restaurant

Mobile-first restaurant landing + admin panel. Next.js 15 / SQLite / Tailwind.

## Local

```bash
npm install
npm run dev
```

Visit http://localhost:3000 and http://localhost:3000/admin (default password `pizzara2026`).

## Env

| Key | Description |
| --- | --- |
| `ADMIN_PASSWORD` | admin login password |
| `ADMIN_SECRET` | 32+ char secret for JWT signing |
| `DATA_DIR` | sqlite storage dir (default `./data`) |
| `UPLOAD_DIR` | image uploads dir (default `./public/uploads`) |

## Deploy

Docker image is self-contained. Mount `/data` (sqlite db) and `/app/public/uploads` for persistence.
