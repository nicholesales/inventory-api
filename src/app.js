const express = require('express');
const app = express();
const productsRoutes = require('./routes/productsRoutes');
const tagsRoutes = require('./routes/tagsRoutes');
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRoutes);
app.use('/api/tags', tagsRoutes);


module.exports = app;
