import { DataTypes } from "sequelize";

import { sequelize } from "../utils/db.js";

const Cart = sequelize.define(
  "cart",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Cart;
