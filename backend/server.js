const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth');

dotenv.config({ quiet: true });

const app = express();

// Middleware
app.use(express.json()); // For parsing application json

// Use a dynamic origin for production or specific origins
const allowedOrigins = ['http://localhost:5173', 'https://activity-days.netlify.app/']; // Add your Netlify URL here
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps) or from the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

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