import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductCategory = sequelize.define(
  "productCategory",
  {},
  {
    timestamps: false,
  }
);

export default ProductCategory;
