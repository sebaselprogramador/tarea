const { guardarContacto } = require('../models/contactoModel');

// POST /api/contactos  (datos ya validados por middleware/validarContacto)
async function crearContacto(req, res, next) {
  try {
    const id = await guardarContacto(req.body);
    res.status(201).json({ mensaje: 'Gracias por escribirnos. Te responderemos pronto.', id });
  } catch (err) {
    next(err);
  }
}

module.exports = { crearContacto };
