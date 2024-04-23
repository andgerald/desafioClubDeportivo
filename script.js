const express = require("express");
const app = express();
const _ = require("lodash");
const fs = require("fs");
const PORT = 3000;

//ruta raiz
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
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

//listamos los nombres de todos los deportes
app.get("/deportes", (req, res) => {
  const { nuevoClub } = JSON.parse(fs.readFileSync("nuevoClub.json", "utf8"));
  const deportes = _.map(nuevoClub, "nombre");
  res.send(deportes);
});

//ruta para editar
app.get("/editar", (req, res) => {
  const { nombre, nuevoNombre } = req.query;
  const { nuevoClub } = JSON.parse(fs.readFileSync("nuevoClub.json", "utf8"));

  //verificamos que se pasen los dos parametros
  if (!nombre || !nuevoNombre) {
    return res
      .status(400)
      .send("Debes ingresar el nombre a editar y el nuevo nombre.");
  }

  // Buscar el club por su nombre
  const nombreIndex = _.findIndex(nuevoClub, { nombre });
  console.log(nombreIndex);

  //verificamos que el nombre ingresado se encuentre en el json
  if (nombreIndex === -1) {
    return res
      .status(404)
      .send(`No se encontró ningún club con el nombre ${nombre}.`);
  }
  //si el nombre esta en el json, editamos el nombre segun la posicion del nombreIndex
  nuevoClub[nombreIndex].nombre = nuevoNombre;
  fs.writeFileSync("nuevoClub.json", JSON.stringify({ nuevoClub }));
  res
    .status(200)
    .send(
      `El club ${nombre} ha sido editado exitosamente. Nuevo nombre: ${nuevoNombre}`
    );
});

app.get("/eliminar/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const { nuevoClub } = JSON.parse(fs.readFileSync("nuevoClub.json", "utf8"));

  //verificamos que esten ingreando el nombre
  if (!nombre) {
    return res.status(400).send("Debes ingresar el nombre a eliminar");
  }
  // Buscar el club por su nombre
  const buscar = _.findIndex(nuevoClub, { nombre });

  //verificamos que el nombre ingresado se encuentre en el json si no se encuentra arroja el error
  if (buscar === -1) {
    return res
      .status(404)
      .send(`No se encontró ningún club con el nombre ${nombre}.`);
  }

  //si el nombre esta en el json, eliminamos nombre segun la posicion de buscar
  nuevoClub.splice(buscar, 1);
  fs.writeFileSync("nuevoClub.json", JSON.stringify({ nuevoClub }));
  res.status(200).send(`El club ${nombre} ha sido elimado con exito`);
});

app.get("*", (req, res) => {
  res.status(500).send(`La ruta ${req.originalUrl} no existe `);
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
