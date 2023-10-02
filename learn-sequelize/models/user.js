import { DataTypes } from "sequelize";

import { sequelize } from "../utils/db.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;
