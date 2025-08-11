const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { connectDB } = require('./models/db'); // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', 
          'https://banking-system-plum.vercel.app'// or your frontend port
  credentials: true
}));
app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');

app.use('/api/user', userRoutes);
app.use('/api/account', accountRoutes);

// Wait for DB connection before starting server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
