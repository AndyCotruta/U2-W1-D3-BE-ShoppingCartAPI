import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import ProductModel from "../products/model.js";
import UserModel from "../users/model.js";

const ReviewModel = sequelize.define("product_reviews", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
    allowNull: false,
  },
});

UserModel.hasMany(ReviewModel, { foreignKey: { allowNull: false } });
ReviewModel.belongsTo(UserModel);

ProductModel.hasMany(ReviewModel, { foreignKey: { allowNull: false } });
ReviewModel.belongsTo(ProductModel);

export default ReviewModel;
