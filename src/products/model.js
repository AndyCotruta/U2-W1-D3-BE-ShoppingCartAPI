import { DataTypes } from "sequelize";
import CategoryModel from "../categories/model.js";
import sequelize from "../db.js";
import ShoppingCartModel from "../shoppingCart/model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";
import ProductsShoppingCartsModel from "./productsShoppingCartsModel.js";

const ProductModel = sequelize.define("products", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    validate: { isUrl: true },
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

ProductModel.belongsToMany(CategoryModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});
CategoryModel.belongsToMany(ProductModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

ProductModel.belongsToMany(ShoppingCartModel, {
  through: ProductsShoppingCartsModel,
  foreignKey: { name: "productId", allowNull: false },
});
ShoppingCartModel.belongsToMany(ProductModel, {
  through: ProductsShoppingCartsModel,
  foreignKey: { name: "shoppingCartId", allowNull: false },
});

export default ProductModel;
