import { DataTypes } from "sequelize";

import { sequelize } from "../utils/db.js";

const CartItem = sequelize.define(
  "cart_item",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default CartItem;
