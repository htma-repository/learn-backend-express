// import { Sequelize } from "sequelize";

// export const sequelize = new Sequelize("learn_express", "root", "admin123", {
//   dialect: "mysql",
//   host: "localhost",
// });

//With Mysql2
import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Rahmanto123!",
  database: "learn_express",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool.promise();
