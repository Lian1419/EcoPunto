CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol VARCHAR(20) DEFAULT 'usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materiales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cantidad DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(20) DEFAULT 'kg',
    estado VARCHAR(20) DEFAULT 'disponible',
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solicitudes (
    id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES materiales(id) ON DELETE CASCADE,
    solicitante_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
