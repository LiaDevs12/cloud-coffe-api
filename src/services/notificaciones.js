
const notificaciones = [];

function crearNotificacion(pedidoId, mensaje) {
  const notificacion = {
    id: notificaciones.length
      ? Math.max(...notificaciones.map(item => item.id)) + 1
      : 1,
    pedidoId,
    mensaje,
    fecha: new Date().toISOString(),
    leida: false
  };

  notificaciones.push(notificacion);

  return notificacion;
}

module.exports = {
  notificaciones,
  crearNotificacion
};
