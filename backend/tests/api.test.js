const request = require('supertest');
const app = require('../server');
const pool = require('../db');

afterAll(async () => {
  await pool.end();
});

describe('Pruebas de la API EcoPunto', () => {
  test('Debe mostrar el mensaje de bienvenida', async () => {
    const respuesta = await request(app).get('/');
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.mensaje).toBe('Bienvenido a EcoPunto API');
  });

  test('Debe comprobar que la API funciona', async () => {
    const respuesta = await request(app).get('/api/saludo');
    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body.mensaje).toBe('EcoPunto está funcionando correctamente');
  });

  test('Debe devolver una lista de materiales', async () => {
    const respuesta = await request(app).get('/api/materiales');
    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });
  test('Debe devolver código 400 si faltan datos del material', async () => {
    const respuesta = await request(app)
      .post('/api/materiales')
      .send({ nombre: 'Cartón' });

    expect(respuesta.statusCode).toBe(400);
    expect(respuesta.body.error).toBe('Datos de material inválidos');
  });

  test('Debe rechazar una cantidad igual a cero', async () => {
    const respuesta = await request(app)
      .post('/api/materiales')
      .send({
        nombre: 'Papel',
        cantidad: 0,
        usuario_id: 1
      });

    expect(respuesta.statusCode).toBe(400);
  });

  test('Debe rechazar una cantidad negativa', async () => {
    const respuesta = await request(app)
      .post('/api/materiales')
      .send({
        nombre: 'Plástico',
        cantidad: -5,
        usuario_id: 1
      });

    expect(respuesta.statusCode).toBe(400);
  });
});