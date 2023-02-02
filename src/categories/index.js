import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CategoryModel from "./model.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await CategoryModel.create(req.body);
    res
      .status(201)
      .send(`Category with id ${categoryId} was created successfully`);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoryModel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get("/:categoryId", async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const category = await CategoryModel.findByPk(categoryId);
  if (category) {
    res.send(category);
  } else {
    next(createHttpError(404, `Category with id ${categoryId} not found`));
  }
});

categoriesRouter.put("/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const [numberOfUpdatedCategories, updatedCategories] =
      await CategoryModel.update(req.body, {
        where: { categoryId: categoryId },
        returning: true,
      });
    if (numberOfUpdatedCategories === 1) {
      res.send(updatedCategories[0]);
    } else {
      next(createHttpError(404, `Category with id ${categoryId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const numberOfDeletedCategories = await CategoryModel.destroy({
      where: { categoryId: categoryId },
    });
    if (numberOfDeletedCategories) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Category with id ${categoryId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
export default categoriesRouter;
