const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth');

dotenv.config({ quiet: true });

const app = express();

// Middleware
app.use(express.json()); // For parsing application json

// Use a dynamic origin list for production or specific origins
// Note: normalize origins (no trailing slash) and prefer returning false instead of throwing
const defaultOrigins = ['http://localhost:5173', 'https://activity-days.netlify.app'];
const allowedOrigins = Array.from(new Set(
  [...defaultOrigins, process.env.FRONTEND_URL].filter(Boolean)
)).map(o => o.replace(/\/$/, ''));

app.use(cors({
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
}));

app.options('*', cors());

// Ensure OPTIONS preflight requests are handled by the CORS middleware
app.options('*', cors());

// Routes placeholder
app.get('/', (req, res) => {
  res.json({ message: 'ActivityDays API' });
});

app.use('/api/auth', authRoutes);

/**********************************************
 * Server host name and port configuration
 **********************************************/
 

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();