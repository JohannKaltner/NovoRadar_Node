const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

//Get Oficinas
router.get("/", (req, res, next) => {
  const pagina = parseInt(req.query.page);
  const limit = 10;
  const offset = (pagina - 1) * limit;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM oficinas limit ${limit}  OFFSET  ${offset}`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }
        const response = {
          quantidade: result.length,
          oficinas: result.map((oficina) => {
            return {
              nome: oficina.nome,
              company: oficina.company,
              cnpj: oficina.cnpj,
              rua: oficina.rua,
              numero: oficina.numero,
              bairro: oficina.bairro,
              cidade: oficina.cidade,
              estado: oficina.estado,
              latitude: oficina.latitude,
              longitude: oficina.longitude,
              id_usuario: oficina.id_usuario,
              criadoEm: oficina.criadoEm,
              atualizadoEm: oficina.atualizadoEm,
              cep: oficina.cep,
              ddd: oficina.ddd,
              telefone1: oficina.telefone1,
              telefone2: oficina.telefone2,
              request: {
                tipo: "GET",
                descricao: "Retorna os detalhes de uma Oficina",
                url: "http://localhost:3000/oficinas/" + oficina.id,
              },
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
});

router.get("/:CategoryId", (req, res, next) => {
  const pagina = parseInt(req.query.page);
  const limit = 10;
  const CategoryId = req.params.CategoryId;
  const offset = (pagina - 1) * limit;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM oficinas WHERE veiculos_aceitos = ${CategoryId} limit ${limit}  OFFSET  ${offset}`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }
        if (result.length == 0) {
          return res
            .status(404)
            .send({ error: "Woopsie Doopsie, Nada Aqui :(" });
        }
        const response = {
          quantidade: result.length,
          detalhes: "Oficinas Por Categoria Recuperadas com Sucesso",
          oficinas: result.map((oficina) => {
            return {
              nome: oficina.nome,
              company: oficina.company,
              cnpj: oficina.cnpj,
              rua: oficina.rua,
              numero: oficina.numero,
              bairro: oficina.bairro,
              cidade: oficina.cidade,
              estado: oficina.estado,
              latitude: oficina.latitude,
              longitude: oficina.longitude,
              id_usuario: oficina.id_usuario,
              criadoEm: oficina.criadoEm,
              atualizadoEm: oficina.atualizadoEm,
              cep: oficina.cep,
              ddd: oficina.ddd,
              telefone1: oficina.telefone1,
              telefone2: oficina.telefone2,
              request: {
                tipo: "GET",
                descricao: "Retorna os detalhes de uma Oficina p/ Categoria",
                url: "http://localhost:3000/oficinas/" + oficina.id,
              },
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
});

//Get Oficina Por Id
router.get("/:id", (req, res, next) => {
  const Id = req.params.id;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM oficinas WHERE id = ${Id};`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }

        if (result.length == 0) {
          return res
            .status(404)
            .send({ error: "Woopsie Doopsie, Nada Aqui :(" });
        }
        const response = {
          detalhes: "Oficina Recuperada com Sucesso",
          Oficina: {
            id: result[0].id,
            nome: result[0].nome,
            company: result[0].company,
            cnpj: result[0].cnpj,
            rua: result[0].rua,
            numero: result[0].numero,
            bairro: result[0].bairro,
            cidade: result[0].cidade,
            estado: result[0].estado,
            latitude: result[0].latitude,
            longitude: result[0].longitude,
            id_usuario: result[0].id_usuario,
            criadoEm: result[0].criadoEm,
            atualizadoEm: result[0].atualizadoEm,
            cep: result[0].cep,
            ddd: result[0].ddd,
            telefone1: result[0].telefone1,
            telefone2: result[0].telefone2,
            request: {
              tipo: "GET",
              descricao: "Retorna todas as Oficina",
              url: "http://localhost:3000/oficinas/",
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

//Post Oficina
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO oficinas (nome, company, cnpj, rua, numero, bairro, cidade, estado, latitude, longitude, id_usuario, criadoEm, atualizadoEm, cep, ddd, telefone1, telefone2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.body.nome,
        req.body.company,
        req.body.cnpj,
        req.body.rua,
        req.body.numero,
        req.body.bairro,
        req.body.cidade,
        req.body.estado,
        req.body.latitude,
        req.body.longitude,
        req.body.id_usuario,
        req.body.criadoEm,
        req.body.atualizadoEm,
        req.body.cep,
        req.body.ddd,
        req.body.telefone1,
        req.body.telefone2,
      ],
      (error, resultado, field) => {
        const response = {
          detalhes: "Oficina Cadastrada com Sucesso",
          OficinaCadastrada: {
            id: resultado.id,
            nome: req.body.nome,
            company: req.body.company,
            cnpj: req.body.cnpj,
            rua: req.body.rua,
            numero: req.body.numero,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            estado: req.body.estado,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            id_usuario: req.body.id_usuario,
            criadoEm: req.body.criadoEm,
            atualizadoEm: req.body.atualizadoEm,
            cep: req.body.cep,
            ddd: req.body.ddd,
            telefone1: req.body.telefone1,
            telefone2: req.body.telefone2,
            request: {
              tipo: "POST",
              descricao: "Insere uma Oficina",
              url: "http://localhost:3000/oficinas/",
            },
          },
        };
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(201).send(response);
      }
    );
  });
});

//Patch Oficina
router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "UPDATE oficinas SET nome = ? , company = ? , cnpj = ? , rua = ?, numero = ? , bairro =? , cidade = ? , estado = ?, latitude = ?, longitude = ?, id_usuario = ?, criadoEm = ?, atualizadoEm = ?, cep = ?, ddd = ?, telefone1 = ?, telefone2 = ? WHERE id = ?",
      [
        req.body.nome,
        req.body.company,
        req.body.cnpj,
        req.body.rua,
        req.body.numero,
        req.body.bairro,
        req.body.cidade,
        req.body.estado,
        req.body.latitude,
        req.body.longitude,
        req.body.id_usuario,
        req.body.criadoEm,
        req.body.atualizadoEm,
        req.body.cep,
        req.body.ddd,
        req.body.telefone1,
        req.body.telefone2,
        req.body.id,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(202).send({
          detalhes: "Sua Oficina foi Editada com Sucesso !",
        });
      }
    );
  });
});

router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "DELETE FROM oficinas WHERE id = ?;",
      [req.body.id],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(202).send({
          detalhes: "Registro removido com sucesso",
        });
      }
    );
  });
});

module.exports = router;
