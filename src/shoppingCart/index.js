import express from "express";
import createHttpError from "http-errors";
import ProductModel from "../products/model.js";
import ShoppingCartModel from "./model.js";

const shoppingCartRouter = express.Router();

shoppingCartRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ShoppingCartModel.create(req.body);
    res
      .status(201)
      .send(`Shopping cart with id ${id} was created successfully`);
  } catch (error) {
    next(error);
  }
});

shoppingCartRouter.get("/", async (req, res, next) => {
  try {
    const shoppingCarts = await ShoppingCartModel.findAll({
      include: { model: ProductModel },
    });
    res.send(shoppingCarts);
  } catch (error) {
    next(error);
  }
});

shoppingCartRouter.get("/:shoppingCartId", async (req, res, next) => {
  try {
    const shoppingCartId = req.params.shoppingCartId;
    const shoppingCart = await ShoppingCartModel.findByPk(shoppingCartId);
    if (shoppingCart) {
      res.send(shoppingCart);
    } else {
      next(
        createHttpError(
          404,
          `Shopping Cart with id ${shoppingCartId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

shoppingCartRouter.put("/:shoppingCartId", async (req, res, next) => {
  try {
    const shoppingCartId = req.params.shoppingCartId;
    const [numberOfDeletedShoppingCarts, updatedShoppingCarts] =
      await ShoppingCartModel.update(req.body, {
        where: { id: shoppingCartId },
        returning: true,
      });
    if (numberOfDeletedShoppingCarts === 1) {
      res.send(updatedShoppingCarts[0]);
    } else {
      next(
        createHttpError(
          404,
          `Shopping Cart with id ${shoppingCartId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

shoppingCartRouter.delete("/:shoppingCartId", async function (req, res) {
  try {
    const shoppingCartId = req.params.shoppingCartId;
    const deletedShoppingCart = await ShoppingCartModel.destroy({
      where: { id: shoppingCartId },
    });
    if (deletedShoppingCart) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Shopping Cart with id ${shoppingCartId} not found`
        )
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default shoppingCartRouter;
