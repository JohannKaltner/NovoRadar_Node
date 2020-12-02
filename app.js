const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const RotaUsuario = require("./routes/usuarios");
const RotaOficinas = require("./routes/oficinas");
const RotaAgendamentos = require("./routes/agendamento");

//Morgan para Logs
app.use(morgan("dev"));

//Encoded false para BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//BodyParser
app.use(bodyParser.json());

//Cors
app.use((req, res, next) => {
  res.header("Acess-Control-Allow-Origin", "*");
  res.header(
    "Acess-Control-Allow-Header",
    "Content-Type",
    "Origin,X-Requrested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Acess-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

//Rota Oficinas
app.use("/oficina", RotaOficinas);

//Rota User
app.use("/usuarios", RotaUsuario);

app.use("/agendamentos", RotaUsuario);

//Error Handling
app.use((req, res, next) => {
  const erro = new Error("Woopsie Doopsie, Nada foi encontrado :(");
  erro.status = 404;
  next(erro);
});

//Error Message
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    Detalhes: {
      mensagem: error.message,
    },
  });
});

//Module Exports
module.exports = app;
