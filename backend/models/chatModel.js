const db = require('../config/db');

// Guarda un mensaje del chat (rol: 'usuario' | 'asistente')
async function guardarMensajeChat(sesionId, rol, mensaje) {
  await db.execute(
    'INSERT INTO chat_mensajes (sesion_id, rol, mensaje) VALUES (?, ?, ?)',
    [sesionId, rol, mensaje]
  );
}

module.exports = { guardarMensajeChat };
