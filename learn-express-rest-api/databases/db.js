import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "learn_rest_api",
  "root",
  "Rahmanto123!",
  {
    host: "localhost",
    dialect: "mysql",
    timezone: "+07:00",
    logging: console.log,
  }
);
