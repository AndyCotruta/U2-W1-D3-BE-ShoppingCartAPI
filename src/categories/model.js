import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const CategoryModel = sequelize.define("categories", {
  categoryId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default CategoryModel;
