const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a EcoPunto API' });
});

app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'EcoPunto está funcionando correctamente' });
});

app.get('/api/materiales', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM materiales ORDER BY fecha_registro DESC'
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar materiales' });
  }
});

app.post('/api/materiales', async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, unidad, usuario_id } = req.body;

    if (!nombre || !cantidad || !usuario_id || Number(cantidad) <= 0) {
      return res.status(400).json({ error: 'Datos de material inválidos' });
    }

    const resultado = await pool.query(
      `INSERT INTO materiales
       (nombre, descripcion, cantidad, unidad, usuario_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion || '', cantidad, unidad || 'kg', usuario_id]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo registrar el material' });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor EcoPunto activo en el puerto ${PORT}`);
  });
}

module.exports = app;
