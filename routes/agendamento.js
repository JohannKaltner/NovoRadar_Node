const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

//Get Agendamentos
router.post("/SearchAgendamento/", (req, res, next) => {
  // const pagina = parseInt(req.query.page);
  // const limit = 10;
  // const offset = (pagina - 1) * limit;
  const id = parseInt(req.body.id);
  const situacao = parseInt(req.body.situacao);
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM agendamento where id_oficina = ? AND situacao = ?`,
      //  limit ${limit}  OFFSET  ${offset}
      [id, situacao],
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
              usuario: {
                id_usuario: agendamento.id_usuario,
                primeiro_nome_usuario: agendamento.primeiro_nome_usuario,
                rua_usuario: agendamento.rua_usuario,
                bairro_usuario: agendamento.bairro_usuario,
                numero_usuario: agendamento.numero_usuario,
                telefone_usuario: agendamento.telefone_usuario,
              },
              veiculo: {
                modelo_veiculo: agendamento.modelo_veiculo,
                marca_veiculo: agendamento.marca_veiculo,
                ano_veiculo: agendamento.ano_veiculo,
                tipo_combustivel: agendamento.tipo_combustivel,
              },
              request: {
                tipo: "GET",
                descricao: "Retorna os detalhes do Agendamento",
                url: "http://localhost:3000/agendamento/" + agendamento.id,
              },
            };
          }),
        };
        conn.release();
        return res.status(200).send(response);
      }
    );
  });
});

router.get("/PorId/:AgendamentoId", (req, res, next) => {
  const AgendamentoId = req.params.AgendamentoId;
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM agendamento WHERE id = ${AgendamentoId}`,
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
              usuario: {
                id_usuario: agendamento.id_usuario,
                primeiro_nome_usuario: agendamento.primeiro_nome_usuario,
                rua_usuario: agendamento.rua_usuario,
                bairro_usuario: agendamento.bairro_usuario,
                numero_usuario: agendamento.numero_usuario,
                telefone_usuario: agendamento.telefone_usuario,
              },
              veiculo: {
                modelo_veiculo: agendamento.modelo_veiculo,
                marca_veiculo: agendamento.marca_veiculo,
                ano_veiculo: agendamento.ano_veiculo,
                tipo_combustivel: agendamento.tipo_combustivel,
              },
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

//Post Agendamento
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
          AgendamentoIniciado: {
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
              //url: "http://localhost:3000/agendamento/",
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
router.patch("/AlteraStatus", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "UPDATE oficinas SET situacao = ? WHERE id = ?",
      [req.body.situacao, req.body.id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(202).send({
          detalhes: "Agendamento Atualizado com Sucesso !",
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
        conn.release();
        return res.status(202).send({
          detalhes: "Serviço cancelado com sucesso",
        });
      }
    );
  });
});

module.exports = router;
