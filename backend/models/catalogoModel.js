const db = require('../config/db');

// Servicios activos ordenados
async function listarServicios() {
  const [rows] = await db.query(
    'SELECT id, nombre, descripcion, icono FROM servicios WHERE activo = 1 ORDER BY orden, id'
  );
  return rows;
}

// Especialidades activas ordenadas
async function listarEspecialidades() {
  const [rows] = await db.query(
    'SELECT id, nombre, descripcion, imagen_url FROM especialidades WHERE activo = 1 ORDER BY orden, id'
  );
  return rows;
}

// Precios activos, con el nombre del servicio asociado (si existe)
async function listarPrecios() {
  const [rows] = await db.query(`
    SELECT p.id, p.concepto, p.descripcion, p.monto, p.moneda,
           s.nombre AS servicio
    FROM precios p
    LEFT JOIN servicios s ON s.id = p.servicio_id
    WHERE p.activo = 1
    ORDER BY p.orden, p.id`);
  return rows;
}

// Fotos de la tienda/clinica
async function listarGaleria() {
  const [rows] = await db.query('SELECT id, titulo, imagen_url FROM galeria ORDER BY orden, id');
  return rows;
}

module.exports = { listarServicios, listarEspecialidades, listarPrecios, listarGaleria };
