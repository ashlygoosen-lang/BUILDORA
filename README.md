# Buildora — Property Development Website

React (Vite + Tailwind v4) frontend and Node/Express backend, deployed as **one service**: Express serves the API and the built frontend.

Rebuilt from the Figma Make export (Next.js + Payload tied to Figma Cloud). The design, copy and motion language are kept, with a premium animation layer added on top.

```
frontend/   React app (routes: / /about /developments /developments/:slug /landowners /investors /how-it-works /impact /contact /admin)
backend/    Express API, JSON storage, private land-document uploads
```

## Run locally

```bash
npm run install:all
npm run dev:backend      # http://localhost:4000
npm run dev:frontend     # http://localhost:5173 (proxies /api to 4000)
```

Local admin sign-in at `/admin`: `admin@buildora.co.za` / `buildora-admin` (only when `ADMIN_PASSWORD` is not set and the app is not in production mode).

## Deploy on Railway

The repo root contains `railway.json`. Railway runs `npm run build` and then `npm start`, with a health check at `/api/health`.

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | **yes** | Admin dashboard password (admin login is switched off without it) |
| `ADMIN_EMAIL` | no | Admin login email (default `admin@buildora.co.za`) |
| `ADMIN_SECRET` | recommended | Long random string used to sign admin sessions (keeps you signed in across restarts) |
| `DATA_DIR` | recommended | Mount a Railway volume (e.g. at `/data`) and set `DATA_DIR=/data` so enquiries, documents and edits survive redeploys |

## API

Public:
- `GET /api/developments`: list developments
- `GET /api/developments/:slug`: one development
- `GET /api/stats`: portfolio figures for the animated counters
- `POST /api/enquiries`: multipart form. Landowner enquiries can attach a PDF, JPG or PNG up to 3 MB; file type is checked from the file's contents.

Admin (Bearer token from `POST /api/admin/login`):
- `GET /api/admin/summary`
- `GET /api/admin/enquiries?kind=&status=&q=`, `PATCH`/`DELETE /api/admin/enquiries/:id`, `GET /api/admin/enquiries/:id/document`
- `POST /api/admin/developments`, `PUT`/`DELETE /api/admin/developments/:id` (multipart, optional `image`)

Land documents are stored privately and are only downloadable by a signed-in admin.

## Motion system

All motion uses transform, opacity and clip-path only. Everything is switched off under `prefers-reduced-motion`, and the heavier effects (cursor ring, card tilt, magnetic buttons, hero parallax) only run on desktop with a precise pointer.

- Brand intro loader on the first visit of a session
- Forest-and-gold curtain transitions between pages
- Hero: masked headline lines, gold sheen on the accent line, a drifting ambient light and architectural grid, slow Ken Burns zoom, mouse parallax, a rotating seal ring and a scroll cue
- Headings reveal word by word; images are revealed by a curtain; plot diagrams draw themselves in
- Animated counters fed by the live portfolio
- 3D tilt and light sheen on development cards; spotlight on the partner panels
- Sticky header that frosts and condenses on scroll and hides while you scroll down
- A sliding gold indicator for the active nav link, plus a reading-progress hairline

## Services pages

- `/construction`: modern residential, commercial, structural and industrial building, with a project-brief form (`kind=Construction`)
- `/equipment`: construction equipment and machinery sourcing (buy new or used, hire, lease), with an equipment-quote form (`kind=Equipment`)

Both enquiry types are validated on the server; their extra fields are stored under `details` and shown in the admin dashboard.

## Photography credits

Construction and machinery photos are free to use under the [Unsplash License](https://unsplash.com/license) and are served from Unsplash's CDN (`frontend/src/lib/photos.js`). Photographers: Zizi zi, Lachlan Cormie, Claus Grünstäudl, Kouji Tsuru, John Kakuk, Scott Webb, Jacek Dylag, Scott Blake, Erik Mclean, Thomas Leblanc.
