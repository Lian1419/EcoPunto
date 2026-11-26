function validarMaterial(material) {
  const { nombre, cantidad, usuario_id } = material;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return { valido: false, error: 'Nombre inválido' };
  }

  const cantidadNumerica = Number(cantidad);

  if (!Number.isFinite(cantidadNumerica) || cantidadNumerica <= 0) {
    return { valido: false, error: 'Cantidad inválida' };
  }

  if (!Number.isInteger(Number(usuario_id)) || Number(usuario_id) <= 0) {
    return { valido: false, error: 'Usuario inválido' };
  }

  return { valido: true, error: null };
}

module.exports = validarMaterial;
