const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activityRoutes');

dotenv.config({ quiet: true });

const app = express();

// Middleware
app.use(express.json()); // For parsing application json

// ✅ Simplified working CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'https://activity-days.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));


// Use a dynamic origin list for production or specific origins
// Note: normalize origins (no trailing slash) and prefer returning false instead of throwing
/*const defaultOrigins = ['http://localhost:5173', 'https://activity-days.netlify.app'];
const allowedOrigins = Array.from(new Set(
  [...defaultOrigins, process.env.FRONTEND_URL].filter(Boolean)
)).map(o => o.replace(/\/$/, ''));

const corsOptions = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, mobile apps, or server-to-server)
    if (!origin) return callback(null, true); // allow server-to-server or tools like curl

    const normalized = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalized)) return callback(null, true);

    // Log blocked origin for debugging and return false (don't throw) so CORS middleware can handle it
    console.warn(`CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
    return callback(null, false); // no exception — middleware will handle preflight/response
  },
  optionsSuccessStatus: 200
});

// Use CORS middleware
app.use(corsOptions);

// Handle OPTIONS preflight requests without registering a '*' route (avoids path-to-regexp issues)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return corsOptions(req, res, () => res.sendStatus(200));
  }
  next();
});*/

// Routes placeholder
app.get('/', (req, res) => {
  res.json({ message: 'ActivityDays API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);

/**********************************************
 * Server host name and port configuration
 **********************************************/
 

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();