
const express = require("express");
const app = express();

const inventarioRoutes = require("./routes/inventario");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a Cloud Coffee API"
  });
});

app.use("/api/inventario", inventarioRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Cloud Coffee API ejecutándose en el puerto ${PORT}`);
});
