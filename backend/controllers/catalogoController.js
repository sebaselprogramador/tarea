const modelo = require('../models/catalogoModel');

// GET /api/servicios
async function getServicios(req, res, next) {
  try {
    res.json(await modelo.listarServicios());
  } catch (err) {
    next(err);
  }
}

// GET /api/especialidades
async function getEspecialidades(req, res, next) {
  try {
    res.json(await modelo.listarEspecialidades());
  } catch (err) {
    next(err);
  }
}

// GET /api/precios
async function getPrecios(req, res, next) {
  try {
    res.json(await modelo.listarPrecios());
  } catch (err) {
    next(err);
  }
}

// GET /api/galeria
async function getGaleria(req, res, next) {
  try {
    res.json(await modelo.listarGaleria());
  } catch (err) {
    next(err);
  }
}

module.exports = { getServicios, getEspecialidades, getPrecios, getGaleria };
