import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import {
  Product,
  Review,
  ProductCategory,
  Category,
  User,
} from "../../db/models/index.js";
const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await Product.create(req.body);
    if (req.body.categories) {
      await ProductCategory.bulkCreate(
        req.body.categories.map((category) => {
          return {
            categoryId: category,
            productId,
          };
        })
      );
    }
    res
      .status(201)
      .send(`Product with id ${productId} was created successfully`);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (req.query.minPrice && req.query.maxPrice)
      query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
    if (req.query.category)
      query.category = { [Op.iLike]: `${req.query.category}` };
    const products = await Product.findAll({
      where: { ...query },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        { model: Category },
        { model: Review, include: { model: User } },
      ],
      // include: { model: Review },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findByPk(productId, {
    include: [{ model: Category }, { model: Review, include: { model: User } }],
  });
  if (product) {
    res.send(product);
  } else {
    next(createHttpError(404, `Product with id ${productId} not found`));
  }
});
productsRouter.get("/:productId/reviews", async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findByPk(productId, {
    include: {
      model: Review,
    },
  });
  if (product) {
    res.send(product);
  } else {
    next(createHttpError(404, `Product with id ${productId} not found`));
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const [numberOfUpdatedProducts, updatedProducts] = await Product.update(
      req.body,
      {
        where: { productId: productId },
        include: { model: Category },
        returning: true,
      }
    );
    if (req.body.categories) {
      await ProductCategory.destroy({ where: { productId } });
      await ProductCategory.bulkCreate(
        req.body.categories.map((category) => {
          return {
            categoryId: category,
            productId,
          };
        })
      );
    }
    if (numberOfUpdatedProducts === 1) {
      res.send(updatedProducts[0]);
    } else {
      next(createHttpError(404, `Product with id ${productId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const numberOfDeletedProducts = await Product.destroy({
      where: { productId: productId },
    });
    if (numberOfDeletedProducts) {
      const numberOfDeletedReviews = await ProductCategory.destroy({
        where: { productProductId: productId },
      });
      res.status(204).send();
    } else {
      next(createHttpError(404, `Product with id ${productId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
export default productsRouter;
