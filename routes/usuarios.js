// const express = require("express");
// const router = express.Router();
// const mysql = require("../mysql").pool;
// const bcrypt = require("bcrypt");
// //Cadastro

// router.post("/cadastro", (req, res, next) => {
//   mysql.getConnection((error, conn) => {
//     if (error) {
//       return res.status(500).send({ error: error });
//     }
//     bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
//       if (errBcrypt) {
//         return res.status(500).send({ error: errBcrypt });
//       }
//        conn.query(
//         "INSERT INTO `users` (`primeiro_nome`, `ultimo_nome`, `email`, `rua`, `numero`, `bairro`, `cidade`, `estado`, `lat`, `long`, `nascimento`, `genero`, `criadoEm`, `atualizadoEm`, `senha`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//         [
//           req.body.primeiro_nome,
//           req.body.ultimo_nome,
//           req.body.email,
//           req.body.rua,
//           req.body.numero,
//           req.body.bairro,
//           req.body.cidade,
//           req.body.estado,
//           req.body.lat,
//           req.body.long,
//           req.body.nascimento,
//           req.body.genero,
//           req.body.criadoEm,
//           req.body.atualizadoEm,
//           hash,
//         ],
//         (error, resultado, field) => {
//           if (error) {
//             return res.status(500).send({ error: error });
//           }
//           const response = {
//             detalhes: "Oficina Cadastrada com Sucesso",
//             OficinaCadastrada: {
//               id: resultado.id,
//               primeiro_nome: req.body.primeiro_nome,
//               ultimo_nome: req.body.ultimo_nome,
//               email: req.body.email,
//               rua: req.body.rua,
//               numero: req.body.numero,
//               bairro: req.body.bairro,
//               estado: req.body.estado,
//               lat: parseFloat("-" + req.body.lat),
//               long: parseFloat("-" + req.body.long),
//               nascimento: req.body.nascimento,
//               criadoEm: req.body.criadoEm,
//               atualizadoEm: req.body.atualizadoEm,
//               request: {
//                 tipo: "POST",
//                 descricao: "Insere uma Oficina",
//                 url: "http://localhost:3000/oficinas/",
//               },
//             },
//           };
//           conn.release();
//           res.status(201).send(response);
//         }
//       );
//     });
//   });
// });
// module.exports = router;

const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/cadastro", (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [req.body.email],
      (error, results) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (results.length > 0) {
          res.status(409).send({ mensagem: "Usuário já cadastrado" });
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }
            conn.query(
              "INSERT INTO `users` (`primeiro_nome`, `ultimo_nome`, `email`, `rua`, `numero`, `bairro`, `cidade`, `estado`, `lat`, `long`, `nascimento`, `genero`, `criadoEm`, `atualizadoEm`, `senha`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                req.body.primeiro_nome,
                req.body.ultimo_nome,
                req.body.email,
                req.body.rua,
                req.body.numero,
                req.body.bairro,
                req.body.cidade,
                req.body.estado,
                req.body.lat,
                req.body.long,
                req.body.nascimento,
                req.body.genero,
                req.body.criadoEm,
                req.body.atualizadoEm,
                hash,
              ],
              (error, results) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }
                response = {
                  mensagem: "Usuário criado com sucesso",
                  usuarioCriado: {
                    id: results.insertId,
                    email: req.body.email,
                  },
                };
                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
});

router.post("/login", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const query = `SELECT * FROM users WHERE email = ?`;
    conn.query(query, [req.body.email], (error, results, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error: error });
      }
      if (results.length < 1) {
        return res.status(401).send({ mensagem: "Falha na autenticação" });
      }
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) {
          return res.status(401).send({ mensagem: "Falha na autenticação" });
        }
        if (result) {
          const expiresIn = 24 * 60 * 60;
          const token = jwt.sign(
            {
              id: results[0].id,
              email: results[0].email,
              nome: results[0].nome,
              cidade: results[0].cidade,
              rua: results[0].rua,
              numero: results[0].numero,
              estado: results[0].estado,
              lat: results[0].lat,
              long: results[0].long,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: expiresIn,
            }
          );
          return res.status(200).send({
            mensagem: "Autenticado com sucesso",
            token: token,
            usuario: {
              id: results[0].id,
              email: results[0].email,
              nome: results[0].nome,
              cidade: results[0].cidade,
              rua: results[0].rua,
              numero: results[0].numero,
              estado: results[0].estado,
              lat: results[0].lat,
              long: results[0].long,
            },
          });
        }
        return res.status(401).send({ mensagem: "Falha na autenticação" });
      });
    });
  });
});

module.exports = router;
