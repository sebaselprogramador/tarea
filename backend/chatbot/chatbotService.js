const { obtenerInfoClinica } = require('../models/infoModel');
const { listarServicios, listarPrecios } = require('../models/catalogoModel');
const { guardarMensajeChat } = require('../models/chatModel');
const { llamarOllama } = require('./ollamaClient');

const MAX_HISTORIAL = 10;     // mensajes previos que se envian al modelo
const MAX_MENSAJE = 1000;     // caracteres maximos por mensaje del usuario

// Construye el prompt de sistema con datos reales de la BD (servicios, precios, contacto)
async function construirSystemPrompt() {
  const [info, servicios, precios] = await Promise.all([
    obtenerInfoClinica(),
    listarServicios(),
    listarPrecios(),
  ]);

  const lineasServicios = servicios.map((s) => `- ${s.nombre}: ${s.descripcion}`).join('\n');
  const lineasPrecios = precios.map((p) => `- ${p.concepto}: ${p.monto} ${p.moneda}`).join('\n');

  return [
    `Eres el asistente virtual de ${info?.nombre || 'la veterinaria'}.`,
    'Responde en espanol, de forma breve, amable y clara.',
    'Solo usa la informacion de esta lista. Si no sabes algo, di que consulten directamente a la clinica.',
    'No des diagnosticos medicos: en emergencias recomienda acudir de inmediato a la clinica.',
    '',
    `Direccion: ${info?.direccion || 'no disponible'}`,
    `Telefono: ${info?.telefono || 'no disponible'}`,
    `Horario: ${info?.horario || 'no disponible'}`,
    '',
    'Servicios:',
    lineasServicios || '- (sin servicios registrados)',
    '',
    'Precios referenciales:',
    lineasPrecios || '- (sin precios registrados)',
  ].join('\n');
}

// Recibe el mensaje del usuario, consulta a Ollama (gemma3) y devuelve la respuesta
async function responderChat({ mensaje, sesionId, historial = [] }) {
  const texto = String(mensaje || '').trim().slice(0, MAX_MENSAJE);
  if (!texto) {
    const err = new Error('El mensaje no puede estar vacio');
    err.status = 400;
    throw err;
  }

  const sistema = await construirSystemPrompt();

  // Solo se aceptan roles validos del historial enviado por el frontend
  const previos = (Array.isArray(historial) ? historial : [])
    .filter((m) => m && (m.rol === 'usuario' || m.rol === 'asistente') && m.contenido)
    .slice(-MAX_HISTORIAL)
    .map((m) => ({
      role: m.rol === 'usuario' ? 'user' : 'assistant',
      content: String(m.contenido).slice(0, MAX_MENSAJE),
    }));

  const mensajes = [
    { role: 'system', content: sistema },
    ...previos,
    { role: 'user', content: texto },
  ];

  let respuesta;
  try {
    respuesta = await llamarOllama(mensajes);
  } catch (err) {
    console.error('[CHATBOT] Ollama no disponible:', err.message);
    respuesta = 'Lo siento, el asistente no esta disponible en este momento. Puedes escribirnos por el formulario de contacto o llamarnos.';
  }

  if (sesionId) {
    try {
      await guardarMensajeChat(String(sesionId).slice(0, 64), 'usuario', texto);
      await guardarMensajeChat(String(sesionId).slice(0, 64), 'asistente', respuesta);
    } catch (err) {
      console.error('[CHATBOT] No se pudo guardar el historial:', err.message);
    }
  }

  return respuesta;
}

module.exports = { responderChat };
