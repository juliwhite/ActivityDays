# ActivityDays

Monorepo with frontend and backend for ActivityDays.

Structure

- backend/ — Express + Mongoose API
- frontend/ — Vite (vanilla JS) frontend

Quick start

1. Backend
   ```bash
   cd backend
   npm install
   cp .env .env.local # edit MONGO_URI if needed
   npm run dev
   ```

2. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Notes

- Make sure you have Node (recommended 18+) installed.
- If you use a local MongoDB, start the service or point `MONGO_URI` to Atlas.
