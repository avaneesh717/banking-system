const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // or your frontend port
  credentials: true
}));
app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');

app.use('/api/user', userRoutes);
app.use('/api/account', accountRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
