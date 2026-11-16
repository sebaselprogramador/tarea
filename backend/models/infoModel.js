const db = require('../config/db');

// Datos generales de la clinica (Inicio, Nosotros, Contactos)
async function obtenerInfoClinica() {
  const [rows] = await db.query('SELECT * FROM info_clinica ORDER BY id LIMIT 1');
  return rows[0] || null;
}

// Multimedia (videos/imagenes). Ej: clave = 'hero_video'
async function obtenerMultimedia(clave) {
  const [rows] = await db.query('SELECT * FROM multimedia WHERE clave = ? LIMIT 1', [clave]);
  return rows[0] || null;
}

module.exports = { obtenerInfoClinica, obtenerMultimedia };
