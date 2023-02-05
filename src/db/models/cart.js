import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Cart = sequelize.define("cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

export default Cart;
