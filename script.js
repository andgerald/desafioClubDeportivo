const express = require("express");
const app = express();

const fs = require("fs");
const PORT = 3000;

app.get("/agregar", (req, res) => {
  const { nombre, precio } = req.query;
  const data = { nombre, precio };

  if (!nombre || !precio) {
    return res
      .status(400)
      .send(`Faltan parametros Ingresaste Nombre: ${nombre}, precio:${precio}`);
  } else {
    fs.writeFileSync("nuevoClub.json", JSON.stringify(data));

    res.status(200).send("Club agregado con exito!");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
