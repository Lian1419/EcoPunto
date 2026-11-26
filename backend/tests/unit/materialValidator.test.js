const validarMaterial = require('../../validators/materialValidator');

describe('Pruebas unitarias del validador de materiales', () => {

  test('Debe aceptar un material con datos correctos', () => {
    const resultado = validarMaterial({
      nombre: 'Cartón',
      cantidad: 15,
      usuario_id: 1
    });

    expect(resultado.valido).toBe(true);
  });

  test('Debe rechazar un nombre vacío', () => {
    const resultado = validarMaterial({
      nombre: '   ',
      cantidad: 10,
      usuario_id: 1
    });

    expect(resultado.valido).toBe(false);
  });

  test('Debe rechazar un nombre que no sea texto', () => {
    const resultado = validarMaterial({
      nombre: 123,
      cantidad: 10,
      usuario_id: 1
    });

    expect(resultado.valido).toBe(false);
  });

  test('Debe rechazar una cantidad igual a cero', () => {
    const resultado = validarMaterial({
      nombre: 'Papel',
      cantidad: 0,
      usuario_id: 1
    });

    expect(resultado.valido).toBe(false);
  });

  test('Debe rechazar una cantidad negativa', () => {
    const resultado = validarMaterial({
      nombre: 'Plástico',
      cantidad: -5,
      usuario_id: 1
    });

    expect(resultado.valido).toBe(false);
  });

  test('Debe rechazar un usuario inválido', () => {
    const resultado = validarMaterial({
      nombre: 'Vidrio',
      cantidad: 8,
      usuario_id: 0
    });

    expect(resultado.valido).toBe(false);
  });

});
