const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');

dotenv.config({ quiet: true });

const app = express();

// Middleware
app.use(express.json()); // For parsing application json

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
