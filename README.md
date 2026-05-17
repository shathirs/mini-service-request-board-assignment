# Mini Service Request Board

This repository contains two separate applications:

- `backend`: Express + MongoDB API
- `frontend`: Next.js web app

## Live Deployment

- Frontend (Vercel): `https://mini-service-request-board-assignme.vercel.app/`
- Backend (Render): `https://mini-service-request-board-assignment.onrender.com/`

Special note: the backend is hosted on Render's free tier, so after long inactivity the API may need a short wake-up time on the first request.

## Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm 9+
- MongoDB instance (local or remote) for the backend

---

## Backend (`backend/`)

### 1) Install dependencies

```bash
cd backend
npm install
```

### 2) Environment variables

Create a `.env` file in `backend/` with:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mini-service-request-board
JWT_SECRET=replace_with_a_secure_secret
```

### 3) Build

No separate build step is required for the backend (it runs directly with Node.js).

### 4) Run

Development mode (auto-reload with nodemon):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Backend default URL: `http://localhost:5000`

### 5) Test

Run all backend tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

## Frontend (`frontend/`)

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Environment variables

Create a `.env.local` file in `frontend/` (optional if using default API URL):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If `NEXT_PUBLIC_API_URL` is not set, the app defaults to `http://localhost:5000/api`.

### 3) Build

```bash
npm run build
```

### 4) Run

Development mode:

```bash
npm run dev
```

Production mode (after build):

```bash
npm start
```

Frontend default URL: `http://localhost:3000`

---

## Typical Local Workflow

1. Start the backend first (`npm run dev` in `backend/`).
2. Start the frontend (`npm run dev` in `frontend/`).
3. Open `http://localhost:3000`.