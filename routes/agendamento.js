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
      `SELECT * FROM agendamento limit ${limit}  OFFSET  ${offset}`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error, response: null });
        }
        const response = {
          quantidade: result.length,
          agendamento: result.map((agendamento) => {
            return {
              id: agendamento.id,
              id_oficina: agendamento.id_oficina,
              id_usuario: agendamento.id_usuario,
              situacao: agendamento.situacao,
              criadoEm: agendamento.criadoEm,
              atualizadoEm: agendamento.atualizadoEm,
              obs: agendamento.obs,
              id_veiculo: agendamento.id_veiculo,
              preco: agendamento.preco,
              prazo: agendamento.prazo,
              request: {
                tipo: "GET",
                descricao: "Retorna os detalhes do Agendamento",
                url: "http://localhost:3000/agendamento/" + agendamento.id,
              },
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
});

router.get("/:AgendamentoId", (req, res, next) => {
  const pagina = parseInt(req.query.page);
  const limit = 10;
  const AgendamentoId = req.params.AgendamentoId;
  const offset = (pagina - 1) * limit;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM oficinas WHERE id = ${AgendamentoId} limit ${limit}  OFFSET  ${offset}`,
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
          detalhes: "Agendamento Recuperado com Sucesso",
          agendamentos: result.map((agendamento) => {
            return {
              id: agendamento.id,
              id_oficina: agendamento.id_oficina,
              id_usuario: agendamento.id_usuario,
              situacao: agendamento.situacao,
              criadoEm: agendamento.criadoEm,
              atualizadoEm: agendamento.atualizadoEm,
              obs: agendamento.obs,
              id_veiculo: agendamento.id_veiculo,
              preco: agendamento.preco,
              prazo: agendamento.prazo,
              request: {
                tipo: "GET",
                descricao: "Retorna os detalhes de um agendamento",
                url: "http://localhost:3000/agendamento/" + agendamento.id,
              },
            };
          }),
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
      "INSERT INTO agendamento (id_oficina, id_usuario, situacao, criadoEm, atualizadoEm, obs, id_veiculo, preco, prazo) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        req.body.id_oficina,
        req.body.id_usuario,
        req.body.situacao,
        req.body.criadoEm,
        req.body.atualizadoEm,
        req.body.obs,
        req.body.id_veiculo,
        req.body.preco,
        req.body.prazo,
      ],
      (error, resultado, field) => {
        const response = {
          detalhes: "Agendado com Sucesso",
          OficinaCadastrada: {
            id_oficina: resultado.id_oficina,
            id_usuario: req.body.id_usuario,
            situacao: req.body.situacao,
            criadoEm: req.body.criadoEm,
            atualizadoEm: req.body.atualizadoEm,
            obs: req.body.obs,
            id_veiculo: req.body.id_veiculo,
            preco: req.body.preco,
            prazo: req.body.prazo,
            request: {
              tipo: "POST",
              descricao: "Cria um Agendamento",
              url: "http://localhost:3000/agendamento/",
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
      "UPDATE oficinas SET id_oficina = ? , id_usuario = ? , situacao = ? , criadoEm = ?, atualizadoEm = ? , obs = ? , id_veiculo = ? , preco = ?, prazo = ?",
      [
        req.body.id_oficina,
        req.body.id_usuario,
        req.body.situacao,
        req.body.criadoEm,
        req.body.atualizadoEm,
        req.body.obs,
        req.body.id_veiculo,
        req.body.preco,
        req.body.prazo,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(202).send({
          detalhes: "Agendamento atualizado com Sucesso !",
        });
      }
    );
  });
});

router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    // // cancelado -> 1 equivale a true, 2 equivale a false
    conn.query(
      "Update FROM agendamentos SET cancelado = 1 WHERE id = ?",
      [req.body.id],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(202).send({
          detalhes: "Serviço cancelado com sucesso",
        });
      }
    );
  });
});

module.exports = router;
