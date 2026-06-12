# UniWORK

UniWORK is a full-stack freelance marketplace for local and global gigs.

## Project Structure

- `backend/` contains the Express API, MongoDB models, JWT auth, geospatial queries, and the seed script.
- `frontend/` contains the React + Vite app, routes, auth state, feed, posting form, and profile page.

## Setup

1. Install dependencies from the repo root:

```bash
npm install
```

2. Create `backend/.env` from `backend/.env.example` and set your MongoDB connection string and JWT secret.

3. Seed the database with sample users and gigs:

```bash
npm run seed
```

4. Start both apps in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

You can also run the root `dev` script if you install the root workspace dependencies first.

## Demo Accounts

The seed script creates these users with the password `password123`:

- `amina@uniwork.test`
- `jay@uniwork.test`
- `noah@uniwork.test`

## Geospatial Query Logic

Local gigs store a GeoJSON `Point` in `Gig.location` and use a `2dsphere` index. The `GET /api/gigs/local` route uses MongoDB `$geoNear` with `maxDistance: 5000`, so the feed only returns gigs within 5km of the authenticated user's saved location.

Global gigs do not use location filtering. The `GET /api/gigs/global` route returns open `global` gigs and supports an optional `category` query string such as `?category=design`.

## Local vs Global

- `local` gigs are hyperlocal and only visible to users within a 5km radius of the gig location.
- `global` gigs are remote-friendly and visible to everyone regardless of location.

The frontend exposes this through a two-tab feed: `Near You` for local gigs and `Global` for remote gigs with category filtering.