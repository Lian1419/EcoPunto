const request = require('supertest');
const app = require('../../server');
const pool = require('../../db');

describe('Pruebas de integración - EcoPunto', () => {
  let usuarioId;

  beforeAll(async () => {
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (correo) DO UPDATE SET nombre = EXCLUDED.nombre
       RETURNING id`,
      ['Integracion EcoPunto', 'integracion@ecopunto.com', 'prueba']
    );

    usuarioId = resultado.rows[0].id;
  });

  afterAll(async () => {
    await pool.query(
      'DELETE FROM materiales WHERE usuario_id = $1',
      [usuarioId]
    );
    await pool.query(
      'DELETE FROM usuarios WHERE id = $1',
      [usuarioId]
    );
    await pool.end();
  });

  test('Debe conectar correctamente con PostgreSQL', async () => {
    const resultado = await pool.query('SELECT NOW()');
    expect(resultado.rows.length).toBe(1);
  });

  test('Debe consultar los materiales almacenados', async () => {
    const respuesta = await request(app).get('/api/materiales');
    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });

  test('Debe registrar un material en PostgreSQL', async () => {
    const respuesta = await request(app)
      .post('/api/materiales')
      .send({
        nombre: 'Cartón de integración',
        descripcion: 'Prueba de almacenamiento',
        cantidad: 5,
        unidad: 'kg',
        usuario_id: usuarioId
      });

    expect(respuesta.statusCode).toBe(201);
    expect(respuesta.body.nombre).toBe('Cartón de integración');
  });

  test('Debe guardar la cantidad correcta del material', async () => {
    const resultado = await pool.query(
      `SELECT cantidad FROM materiales
       WHERE nombre = $1 AND usuario_id = $2`,
      ['Cartón de integración', usuarioId]
    );

    expect(Number(resultado.rows[0].cantidad)).toBe(5);
  });

  test('Debe guardar el estado disponible por defecto', async () => {
    const resultado = await pool.query(
      `SELECT estado FROM materiales
       WHERE nombre = $1 AND usuario_id = $2`,
      ['Cartón de integración', usuarioId]
    );

    expect(resultado.rows[0].estado).toBe('disponible');
  });

  test('Debe relacionar el material con su usuario', async () => {
    const resultado = await pool.query(
      `SELECT u.id AS usuario_id
       FROM materiales m
       INNER JOIN usuarios u ON m.usuario_id = u.id
       WHERE m.nombre = $1 AND m.usuario_id = $2`,
      ['Cartón de integración', usuarioId]
    );

    expect(resultado.rows[0].usuario_id).toBe(usuarioId);
  });
});
