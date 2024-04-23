const express = require("express");
const app = express();
const _ = require("lodash");
const fs = require("fs");
const PORT = 3000;

app.get("/agregar", (req, res) => {
  const { nombre, precio } = req.query;
  const club = { nombre, precio };

  //validamos si se ingresaron los valores en el caso que falte un valor arroja el error
  if (!nombre || !precio) {
    return res
      .status(400)
      .send(`Faltan parametros Ingresaste Nombre: ${nombre}, precio:${precio}`);
  }

  //si pasa la validacion, buscamos si el nombre ingresado se encuentra ya ingresado
  const { nuevoClub } = JSON.parse(fs.readFileSync("nuevoClub.json", "utf8"));
  const repetido = _.find(nuevoClub, { nombre });

  //si el nombre ya esta ingresado arroja el siguiene error
  if (repetido) {
    return res.status(400).send(`El club ${nombre} ya esta agregado`);
  }

  //si no esta ingresado, lo agrega y envia el mensaje
  nuevoClub.push(club);
  fs.writeFileSync("nuevoClub.json", JSON.stringify({ nuevoClub }));
  res.status(200).send("Club agregado con exito!");
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
