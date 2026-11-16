// Valida el body del formulario de contacto antes de llegar al controlador
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarContacto(req, res, next) {
  const { nombre, email, telefono, asunto, mensaje } = req.body || {};
  const errores = [];

  if (!nombre || String(nombre).trim().length < 2) errores.push('El nombre es obligatorio (minimo 2 caracteres).');
  if (!email || !EMAIL_RE.test(String(email).trim())) errores.push('El correo electronico no es valido.');
  if (!mensaje || String(mensaje).trim().length < 5) errores.push('El mensaje es obligatorio (minimo 5 caracteres).');
  if (nombre && String(nombre).length > 120) errores.push('El nombre es demasiado largo.');
  if (asunto && String(asunto).length > 150) errores.push('El asunto es demasiado largo.');

  if (errores.length) return res.status(400).json({ error: 'Datos invalidos', detalles: errores });

  // Normaliza los datos antes de guardarlos
  req.body = {
    nombre: String(nombre).trim(),
    email: String(email).trim().toLowerCase(),
    telefono: telefono ? String(telefono).trim() : null,
    asunto: asunto ? String(asunto).trim() : null,
    mensaje: String(mensaje).trim(),
  };
  next();
}

module.exports = validarContacto;
