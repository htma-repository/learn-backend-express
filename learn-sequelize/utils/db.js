import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("learn_sequelize", "root", "admin123", {
  dialect: "mysql",
  host: "localhost",
  timezone: "+07:00",
});
