const request = require('supertest');
const app = require('../../server');
const pool = require('../../db');

describe('Pruebas E2E - EcoPunto', () => {
  let usuarioId;
  let materialId;

  beforeAll(async () => {
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ['Usuario E2E', 'usuario.e2e@ecopunto.com', 'prueba']
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

  test('1. Debe acceder a la página principal de la API', async () => {
    const respuesta = await request(app).get('/');
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.mensaje).toBe('Bienvenido a EcoPunto API');
  });

  test('2. Debe comprobar el estado de la API', async () => {
    const respuesta = await request(app).get('/api/saludo');
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.mensaje).toBe('EcoPunto está funcionando correctamente');
  });

  test('3. Debe registrar un material completo', async () => {
    const respuesta = await request(app)
      .post('/api/materiales')
      .send({
        nombre: 'Papel E2E',
        descripcion: 'Papel para reciclaje',
        cantidad: 15,
        unidad: 'kg',
        usuario_id: usuarioId
      });

    expect(respuesta.statusCode).toBe(201);
    expect(respuesta.body.nombre).toBe('Papel E2E');
    materialId = respuesta.body.id;
  });

  test('4. Debe encontrar el material registrado', async () => {
    const respuesta = await request(app).get('/api/materiales');

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.some(m => m.id === materialId)).toBe(true);
  });

  test('5. Debe conservar los datos del material en PostgreSQL', async () => {
    const resultado = await pool.query(
      'SELECT * FROM materiales WHERE id = $1',
      [materialId]
    );

    expect(resultado.rows.length).toBe(1);
    expect(Number(resultado.rows[0].cantidad)).toBe(15);
  });

  test('6. Debe rechazar el registro de un material inválido', async () => {
    const respuesta = await request(app)
      .post('/api/materiales')
      .send({
        nombre: 'Material inválido',
        cantidad: -10,
        usuario_id: usuarioId
      });

    expect(respuesta.statusCode).toBe(400);
  });
});
