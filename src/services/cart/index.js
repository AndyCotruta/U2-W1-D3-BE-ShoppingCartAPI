import express from "express";
import { Cart, Product, Category } from "../../db/models/index.js";
import sequelize from "sequelize";
const router = express.Router();

router.route("/:userId").get(async (req, res, next) => {
  try {
    // select "productId", count(id) from carts where "userId"='87c58d3e-2384-4ff7-b05a-e79e2cbd6abe' group by "productId"
    const data = await Cart.findAll({
      include: [
        {
          model: Product,
        },
      ],
      attributes: [
        "productId",
        [sequelize.fn("count", sequelize.col("cart.id")), "unitQty"],
        [sequelize.fn("sum", sequelize.col("product.price")), "unitTotalPrice"],
      ],

      group: ["productId", "product.id"],

      where: {
        userId: req.params.userId,
      },
    });

    const totalQty = await Cart.count({
      where: {
        userId: req.params.userId,
      },
    });

    const totalSum = await Cart.sum("product.price", {
      include: { model: Product, attributes: [] },
    });

    res.send({ data, totalQty, totalSum });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router
  .route("/:productId/:userId")
  .delete(async (req, res, next) => {
    try {
      const { userId, productId } = req.params;
      const data = await Cart.destroy({
        where: {
          userId,
          productId,
        },
      });
      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { userId, productId } = req.params;
      const data = await Cart.create({ userId, productId });
      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

export default router;
