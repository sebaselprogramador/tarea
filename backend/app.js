require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => res.json({ mensaje: 'API Veterinaria funcionando', api: '/api' }));
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});

module.exports = app;
