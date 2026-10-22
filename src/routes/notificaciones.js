
const express = require("express");
const router = express.Router();

const { notificaciones } = require("../services/notificaciones");

// Consultar todas las notificaciones
router.get("/", (req, res) => {
  res.json({
    mensaje: "Notificaciones consultadas correctamente",
    data: notificaciones
  });
});

// Consultar notificaciones de un pedido
router.get("/pedido/:pedidoId", (req, res) => {
  const pedidoId = Number(req.params.pedidoId);

  const resultado = notificaciones.filter(
    item => item.pedidoId === pedidoId
  );

  res.json({
    mensaje: "Notificaciones del pedido consultadas correctamente",
    data: resultado
  });
});

// Marcar una notificación como leída
router.patch("/:id/leida", (req, res) => {
  const id = Number(req.params.id);
  const notificacion = notificaciones.find(item => item.id === id);

  if (!notificacion) {
    return res.status(404).json({
      mensaje: "Notificación no encontrada"
    });
  }

  notificacion.leida = true;

  res.json({
    mensaje: "Notificación marcada como leída",
    data: notificacion
  });
});

module.exports = router;
