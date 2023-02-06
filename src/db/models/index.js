import Product from "./products.js";
import Review from "./reviews.js";
import Category from "./categories.js";
import User from "./users.js";
import ProductCategory from "./productCategory.js";
import Cart from "./cart.js";

Product.hasMany(Review, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
});
Review.belongsTo(Product, { onDelete: "CASCADE" });

User.hasMany(Review, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
Review.belongsTo(User, { onDelete: "CASCADE" });

Category.belongsToMany(Product, {
  through: ProductCategory,
  onDelete: "CASCADE",
});
Product.belongsToMany(Category, {
  through: ProductCategory,
  onDelete: "CASCADE",
});

User.hasMany(Cart, { onDelete: "CASCADE", foreignKey: { allowNull: false } });
Cart.belongsTo(User, { onDelete: "CASCADE" });

Product.hasMany(Cart, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
});
Cart.belongsTo(Product, { onDelete: "CASCADE" });

export { Product, Review, Category, ProductCategory, User, Cart };
