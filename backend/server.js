require('dotenv').config();   

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/sensors', require('./routes/sensors'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
