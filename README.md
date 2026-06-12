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

2. Create `backend/.env` from `backend/.env.example` and set your MongoDB connection string, JWT secret, port, and client URL.

3. Create `frontend/.env` from `frontend/.env.example` and set `VITE_API_URL` for your backend API.

4. Seed the database with sample users and gigs:

```bash
npm run seed
```

5. Start both apps in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

You can also run the root `dev` script if you install the root workspace dependencies first.

## Testing

Run the backend test suite with:

```bash
npm run test --workspace backend
```

The tests use `mongodb-memory-server`, so they do not require a live MongoDB Atlas connection.

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

## Deployment

### Backend on Render

1. Create a new Render Web Service from the repository.
2. Set the start command to `npm run start --workspace backend`.
3. Set these environment variables in Render:

- `MONGODB_URI` pointing to MongoDB Atlas
- `JWT_SECRET` with a strong random value
- `PORT` as provided by Render or leave unset if Render injects it
- `CLIENT_URL` to your Vercel frontend URL

### Frontend on Vercel

1. Import the `frontend` app as a Vercel project.
2. Set `VITE_API_URL` to your deployed Render backend, for example `https://your-app.onrender.com/api`.
3. Build command: `npm run build --workspace frontend`
4. Output directory: `frontend/dist`