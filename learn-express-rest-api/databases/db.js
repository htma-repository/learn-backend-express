import { Sequelize } from "sequelize";

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: "localhost",
  dialect: "mysql",
  timezone: "+07:00",
  logging: console.log,
});
