-- =====================================================================
-- Base de datos: veterinaria_db (MySQL 8+)
-- Tablas que necesita el frontend (una por seccion de la web)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS veterinaria_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE veterinaria_db;

DROP TABLE IF EXISTS chat_mensajes;
DROP TABLE IF EXISTS contactos;
DROP TABLE IF EXISTS galeria;
DROP TABLE IF EXISTS precios;
DROP TABLE IF EXISTS especialidades;
DROP TABLE IF EXISTS servicios;
DROP TABLE IF EXISTS multimedia;
DROP TABLE IF EXISTS info_clinica;

-- Inicio / Nosotros / Contactos: datos generales de la veterinaria
CREATE TABLE info_clinica (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  historia TEXT,
  mision TEXT,
  direccion VARCHAR(255),
  telefono VARCHAR(50),
  email VARCHAR(120),
  horario VARCHAR(255),
  latitud DECIMAL(10,7),
  longitud DECIMAL(10,7),
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inicio: videos/imagenes multimedia (videos de Pexels en bucle)
CREATE TABLE multimedia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(60) NOT NULL UNIQUE,      -- ej: 'hero_video'
  tipo ENUM('video','imagen') NOT NULL,
  url VARCHAR(500) NOT NULL,
  descripcion VARCHAR(255),
  fuente VARCHAR(255)                     -- credito, ej: 'Pexels'
);

-- Servicios: todos los servicios que ofrece la veterinaria
CREATE TABLE servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  icono VARCHAR(50),                      -- nombre de icono/emoji
  orden INT DEFAULT 0,
  activo TINYINT(1) DEFAULT 1
);

-- Especialidades
CREATE TABLE especialidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  imagen_url VARCHAR(500),
  orden INT DEFAULT 0,
  activo TINYINT(1) DEFAULT 1
);

-- Precios: lista de precios (opcionalmente ligada a un servicio)
CREATE TABLE precios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  servicio_id INT NULL,
  concepto VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255),
  monto DECIMAL(10,2) NOT NULL,
  moneda VARCHAR(5) DEFAULT 'BOB',
  orden INT DEFAULT 0,
  activo TINYINT(1) DEFAULT 1,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE SET NULL
);

-- Nosotros: fotos de la tienda / clinica
CREATE TABLE galeria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150),
  imagen_url VARCHAR(500) NOT NULL,
  orden INT DEFAULT 0
);

-- Contactos: mensajes enviados desde el formulario
CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  telefono VARCHAR(50),
  asunto VARCHAR(150),
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chatbot: historial de conversaciones (opcional, para analisis)
CREATE TABLE chat_mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sesion_id VARCHAR(64) NOT NULL,
  rol ENUM('usuario','asistente') NOT NULL,
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sesion (sesion_id)
);

-- =====================================================================
-- Datos de ejemplo (editar con la informacion real de la veterinaria)
-- =====================================================================
INSERT INTO info_clinica (nombre, historia, mision, direccion, telefono, email, horario, latitud, longitud) VALUES
('Veterinaria Patitas Felices',
 'Fundada en 2012 por un equipo de veterinarios apasionados por el bienestar animal. Hoy atendemos a cientos de familias y sus mascotas.',
 'Cuidar la salud y la felicidad de cada mascota con atencion cercana, moderna y responsable.',
 'Av. Principal #123, Santa Cruz, Bolivia',
 '+591 3 000-0000',
 'contacto@patitasfelices.com',
 'Lunes a Sabado 08:00 - 19:00 | Domingos 09:00 - 13:00',
 -17.7833000, -63.1821000);

INSERT INTO multimedia (clave, tipo, url, descripcion, fuente) VALUES
('hero_video', 'video', 'https://www.pexels.com/REEMPLAZAR-con-el-video-de-animales', 'Video en bucle de animales', 'Pexels');

INSERT INTO servicios (nombre, descripcion, icono, orden) VALUES
('Consulta general', 'Revision completa de salud, diagnostico y recomendaciones.', '🩺', 1),
('Vacunacion', 'Esquemas de vacunacion para perros y gatos segun su edad.', '💉', 2),
('Cirugia', 'Procedimientos quirurgicos programados con anestesia monitorizada.', '🏥', 3),
('Desparasitacion', 'Control interno y externo de parasitos.', '🐾', 4),
('Peluqueria y bano', 'Bano, corte de pelo y cuidado de unas.', '✂️', 5),
('Emergencias', 'Atencion de urgencias en horario extendido.', '🚑', 6);

INSERT INTO especialidades (nombre, descripcion, orden) VALUES
('Medicina interna', 'Diagnostico y tratamiento de enfermedades en organos internos.', 1),
('Dermatologia', 'Alergias, hongos y problemas de piel y pelo.', 2),
('Odontologia', 'Limpieza dental, extracciones y salud bucal.', 3),
('Cardiologia', 'Evaluacion cardiaca con ecografia y electrocardiograma.', 4),
('Animales exoticos', 'Aves, reptiles y pequenos mamiferos.', 5);

INSERT INTO precios (servicio_id, concepto, descripcion, monto, moneda, orden) VALUES
(1, 'Consulta general', 'Incluye revision fisica completa', 80.00, 'BOB', 1),
(2, 'Vacuna antirrabica', 'Dosis anual', 60.00, 'BOB', 2),
(2, 'Esquema basico de cachorro', '3 vacunas + desparasitacion', 250.00, 'BOB', 3),
(3, 'Castracion', 'Incluye anestesia y 24h de control', 350.00, 'BOB', 4),
(4, 'Desparasitacion interna', 'Por dosis', 40.00, 'BOB', 5),
(5, 'Bano completo', 'Segun tamano de la mascota', 70.00, 'BOB', 6),
(6, 'Consulta de emergencia', 'Horario extendido', 150.00, 'BOB', 7);

INSERT INTO galeria (titulo, imagen_url, orden) VALUES
('Recepcion', 'https://images.pexels.com/photos/REEMPLAZAR-1.jpg', 1),
('Sala de consulta', 'https://images.pexels.com/photos/REEMPLAZAR-2.jpg', 2),
('Area de tienda', 'https://images.pexels.com/photos/REEMPLAZAR-3.jpg', 3);
