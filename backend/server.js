const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Connect DB
connectDB();

// Routes placeholder
app.get('/', (req, res) => {
  res.json({ message: 'ActivityDays API' });
});

/**********************************************
 * Server host name and port configuration
 **********************************************/
 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
