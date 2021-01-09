const http = require("http");
const port = process.env.PORT || 2018;
const app = require("./app");
const server = http.createServer(app);
console.log(`servidor rodando na porta ${port}`);
server.listen(port);
