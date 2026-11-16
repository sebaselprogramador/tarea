const { obtenerInfoClinica, obtenerMultimedia } = require('../models/infoModel');

// GET /api/clinica
async function getClinica(req, res, next) {
  try {
    const info = await obtenerInfoClinica();
    if (!info) return res.status(404).json({ error: 'Informacion de la clinica no configurada' });
    res.json(info);
  } catch (err) {
    next(err);
  }
}

// GET /api/multimedia/:clave  (ej: /api/multimedia/hero_video)
async function getMultimedia(req, res, next) {
  try {
    const item = await obtenerMultimedia(req.params.clave);
    if (!item) return res.status(404).json({ error: 'Recurso multimedia no encontrado' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = { getClinica, getMultimedia };
