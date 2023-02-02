import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";
import ReviewModel from "../reviews/model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";
import CategoryModel from "../categories/model.js";
import UserModel from "../users/model.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await ProductModel.create(req.body);
    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
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
    const products = await ProductModel.findAll({
      where: { ...query },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        { model: CategoryModel },
        { model: ReviewModel, include: { model: UserModel } },
      ],
      // include: { model: ReviewModel },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  const productId = req.params.productId;
  const product = await ProductModel.findByPk(productId);
  if (product) {
    res.send(product);
  } else {
    next(createHttpError(404, `Product with id ${productId} not found`));
  }
});
productsRouter.get("/:productId/reviews", async (req, res, next) => {
  const productId = req.params.productId;
  const product = await ProductModel.findByPk(productId, {
    include: {
      model: ReviewModel,
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
    const [numberOfUpdatedProducts, updatedProducts] =
      await ProductModel.update(req.body, {
        where: { id: productId },
        returning: true,
      });
    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
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
    const numberOfDeletedProducts = await ProductModel.destroy({
      where: { productId: productId },
    });
    if (numberOfDeletedProducts) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Product with id ${productId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
export default productsRouter;
