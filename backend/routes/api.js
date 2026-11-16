const express = require('express');
const info = require('../controllers/infoController');
const catalogo = require('../controllers/catalogoController');
const contacto = require('../controllers/contactoController');
const chatbot = require('../controllers/chatbotController');
const validarContacto = require('../middleware/validarContacto');

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true }));

// Nosotros / Inicio
router.get('/clinica', info.getClinica);
router.get('/multimedia/:clave', info.getMultimedia);
router.get('/galeria', catalogo.getGaleria);

// Catalogo
router.get('/servicios', catalogo.getServicios);
router.get('/especialidades', catalogo.getEspecialidades);
router.get('/precios', catalogo.getPrecios);

// Contacto y chatbot
router.post('/contactos', validarContacto, contacto.crearContacto);
router.post('/chatbot', chatbot.chat);

module.exports = router;
