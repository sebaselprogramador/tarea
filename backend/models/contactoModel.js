const db = require('../config/db');

// Guarda un mensaje del formulario de contacto y devuelve su id
async function guardarContacto({ nombre, email, telefono, asunto, mensaje }) {
  const [result] = await db.execute(
    'INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, telefono || null, asunto || null, mensaje]
  );
  return result.insertId;
}

module.exports = { guardarContacto };
