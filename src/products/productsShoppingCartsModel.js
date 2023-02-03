import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductsShoppingCartsModel = sequelize.define("products_shoppingCart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

export default ProductsShoppingCartsModel;
