
const express = require("express");
const router = express.Router();

const pedidos = require("../data/pedidos");
const inventario = require("../data/inventario");
const { crearNotificacion } = require("../services/notificaciones");

const estadosPermitidos = [
  "RECIBIDO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO"
];

// Consultar todos los pedidos
router.get("/", (req, res) => {
  res.json({
    mensaje: "Pedidos consultados correctamente",
    data: pedidos
  });
});

// Consultar un pedido por ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const pedido = pedidos.find(item => item.id === id);

  if (!pedido) {
    return res.status(404).json({
      mensaje: "Pedido no encontrado"
    });
  }

  res.json({
    mensaje: "Pedido encontrado",
    data: pedido
  });
});

// Registrar un pedido
router.post("/", (req, res) => {
  const { productos, cliente } = req.body;

  if (
    typeof cliente !== "string" ||
    !cliente.trim() ||
    !Array.isArray(productos) ||
    productos.length === 0
  ) {
    return res.status(400).json({
      mensaje: "Debes proporcionar el nombre del cliente y al menos un producto"
    });
  }

  const detalles = [];

  for (const item of productos) {
    if (
      !Number.isInteger(item.productoId) ||
      !Number.isInteger(item.cantidad) ||
      item.cantidad <= 0
    ) {
      return res.status(400).json({
        mensaje: "Cada producto debe tener un productoId y una cantidad válida"
      });
    }

    const producto = inventario.find(
      producto => producto.id === item.productoId
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: `No existe el producto con ID ${item.productoId}`
      });
    }

    if (producto.existencias < item.cantidad) {
      return res.status(400).json({
        mensaje: `Existencias insuficientes para ${producto.nombre}`
      });
    }

    detalles.push({
      productoId: producto.id,
      nombre: producto.nombre,
      precioUnitario: producto.precio,
      cantidad: item.cantidad,
      subtotal: producto.precio * item.cantidad
    });
  }

  // Descontar existencias después de validar todos los productos.
  for (const detalle of detalles) {
    const producto = inventario.find(
      item => item.id === detalle.productoId
    );

    producto.existencias -= detalle.cantidad;
  }

  const nuevoPedido = {
    id: pedidos.length
      ? Math.max(...pedidos.map(item => item.id)) + 1
      : 1,
    cliente: cliente.trim(),
    productos: detalles,
    total: detalles.reduce((suma, item) => suma + item.subtotal, 0),
    estado: "RECIBIDO",
    fecha: new Date().toISOString()
  };

  pedidos.push(nuevoPedido);

  crearNotificacion(
    nuevoPedido.id,
    `Tu pedido #${nuevoPedido.id} fue recibido`
  );

  res.status(201).json({
    mensaje: "Pedido registrado correctamente",
    data: nuevoPedido
  });
});

// Actualizar el estado de un pedido
router.patch("/:id/estado", (req, res) => {
  const id = Number(req.params.id);
  const pedido = pedidos.find(item => item.id === id);
  const { estado } = req.body;

  if (!pedido) {
    return res.status(404).json({
      mensaje: "Pedido no encontrado"
    });
  }

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({
      mensaje: "Estado inválido",
      estadosPermitidos
    });
  }

  if (
    pedido.estado === "ENTREGADO" ||
    pedido.estado === "CANCELADO"
  ) {
    return res.status(400).json({
      mensaje: "No se puede cambiar el estado de un pedido finalizado"
    });
  }

  if (pedido.estado === estado) {
    return res.status(400).json({
      mensaje: "El pedido ya tiene ese estado"
    });
  }

  pedido.estado = estado;

  crearNotificacion(
    pedido.id,
    `El pedido #${pedido.id} cambió al estado ${estado}`
  );

  res.json({
    mensaje: "Estado del pedido actualizado correctamente",
    data: pedido
  });
});

module.exports = router;
