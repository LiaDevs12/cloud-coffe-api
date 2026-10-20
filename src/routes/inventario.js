
const express = require("express");
const router = express.Router();

const inventario = require("../data/inventario");

// GET: consultar todos los productos
router.get("/", (req, res) => {
  res.json({
    mensaje: "Inventario consultado correctamente",
    data: inventario
  });
});

// GET: consultar un producto por ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = inventario.find(item => item.id === id);

  if (!producto) {
    return res.status(404).json({
      mensaje: "Producto no encontrado"
    });
  }

  res.json({
    mensaje: "Producto encontrado",
    data: producto
  });
});

// POST: registrar un producto
router.post("/", (req, res) => {
  const { nombre, categoria, precio, existencias } = req.body;

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof categoria !== "string" ||
    !categoria.trim() ||
    typeof precio !== "number" ||
    !Number.isFinite(precio) ||
    precio < 0 ||
    !Number.isInteger(existencias) ||
    existencias < 0
  ) {
    return res.status(400).json({
      mensaje: "Datos inválidos. Revisa nombre, categoría, precio y existencias."
    });
  }

  const nuevoProducto = {
    id: inventario.length
      ? Math.max(...inventario.map(item => item.id)) + 1
      : 1,
    nombre: nombre.trim(),
    categoria: categoria.trim(),
    precio,
    existencias
  };

  inventario.push(nuevoProducto);

  res.status(201).json({
    mensaje: "Producto registrado correctamente",
    data: nuevoProducto
  });
});

// PUT: actualizar un producto completo
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = inventario.findIndex(item => item.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Producto no encontrado"
    });
  }

  const { nombre, categoria, precio, existencias } = req.body;

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof categoria !== "string" ||
    !categoria.trim() ||
    typeof precio !== "number" ||
    !Number.isFinite(precio) ||
    precio < 0 ||
    !Number.isInteger(existencias) ||
    existencias < 0
  ) {
    return res.status(400).json({
      mensaje: "Datos inválidos. Revisa nombre, categoría, precio y existencias."
    });
  }

  inventario[indice] = {
    id,
    nombre: nombre.trim(),
    categoria: categoria.trim(),
    precio,
    existencias
  };

  res.json({
    mensaje: "Producto actualizado correctamente",
    data: inventario[indice]
  });
});

// DELETE: eliminar un producto
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = inventario.findIndex(item => item.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Producto no encontrado"
    });
  }

  const eliminado = inventario.splice(indice, 1)[0];

  res.json({
    mensaje: "Producto eliminado correctamente",
    data: eliminado
  });
});

module.exports = router;
