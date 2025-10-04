# backend

Express + Mongoose API

Setup

```bash
cd backend
npm install
# copy .env and update MONGO_URI if needed
cp .env .env.local
# edit .env.local
```

Run (dev)

```bash
npm run dev
```

Run (prod)

```bash
npm start
```

Config

- `config/db.js` connects to MongoDB using `process.env.MONGO_URI`.
- Add controllers, models and routes under their respective folders.
