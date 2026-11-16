const { responderChat } = require('../chatbot/chatbotService');

// POST /api/chatbot  body: { mensaje: string, sesionId?: string, historial?: [{rol, contenido}] }
async function chat(req, res, next) {
  try {
    const { mensaje, sesionId, historial } = req.body;
    const respuesta = await responderChat({ mensaje, sesionId, historial });
    res.json({ respuesta });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
