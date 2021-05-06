const sql = require("mysql2");

const pool = sql.createPool({
  host: "localhost",
  user: "root",
  database: "conexao",
  password: "pratham",
});

module.exports = pool.promise();
