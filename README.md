# College Alumni Platform (MERN)

A simple alumni network where former students can sign up, build a profile, browse peers, and view public profiles. Built as a monorepo with a React frontend (`/client`) and Express/MongoDB backend (`/server`).

## Prerequisites
- Node.js 18+
- MongoDB running locally or accessible via URI

## Getting started
1. Install server dependencies
   ```bash
   cd server
   npm install
   ```
2. Install client dependencies
   ```bash
   cd ../client
   npm install
   ```
3. Create a `.env` file inside `/server` based on `.env.example`:
   ```env
   MONGO_URI=mongodb://localhost:27017/alumni_platform
   JWT_SECRET=supersecretjwt
   PORT=5000
   CLIENT_ORIGIN=http://localhost:3000
   ```

## Running the app
- Start backend (with nodemon):
  ```bash
  cd server
  npm run dev
  ```
- Start frontend React app:
  ```bash
  cd client
  npm start
  ```
- Or run both with one command from the repo root (uses `concurrently`):
  ```bash
  npm install
  npm run dev
  ```

## API quick reference
- `POST /api/auth/signup` – Register a new alumni
- `POST /api/auth/login` – Login with email/password
- `GET /api/users/me` – Get logged-in user's profile (requires JWT)
- `PUT /api/users/me` – Update profile fields (requires JWT)
- `GET /api/users` – Paginated directory with search/filtering
- `GET /api/users/:id` – Public profile by id

## Frontend overview
- React Router for pages
- Auth context for storing user + JWT (persisted in `localStorage` and cookie from backend)
- Protected pages: Dashboard, Edit Profile, Directory, Public Profile

## Notes
- Keep `CLIENT_ORIGIN` in the backend `.env` in sync with where the React app runs so CORS remains open.
- Passwords are hashed with bcrypt; JWTs are sent in an HTTP-only cookie and also stored client-side for the `Authorization` header.
