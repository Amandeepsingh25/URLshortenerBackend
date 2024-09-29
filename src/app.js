const express = require('express');
const urlRoutes = require('./routes/urlRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/', urlRoutes);

module.exports = app;
