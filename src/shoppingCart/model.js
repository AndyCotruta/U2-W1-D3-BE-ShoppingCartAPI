import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import UserModel from "../users/model.js";

const ShoppingCartModel = sequelize.define("shopping_cart", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  products: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

UserModel.hasMany(ShoppingCartModel, { foreignKey: { allowNull: false } });
ShoppingCartModel.belongsTo(UserModel);

export default ShoppingCartModel;
