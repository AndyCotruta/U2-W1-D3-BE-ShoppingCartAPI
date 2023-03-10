import express from "express";
import createHttpError from "http-errors";
import { Review, Product } from "../../db/models/index.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await Review.create(req.body);
    res.status(201).send(`Review with id ${id} was created successfully`);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: { model: Product },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:reviewId", async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findByPk(reviewId, {
    include: { model: Product },
  });
  if (review) {
    res.send(review);
  } else {
    next(createHttpError(404, `Review with id ${reviewId} not found`));
  }
});

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const [numberOfUpdatedReviews, updatedReviews] = await Review.update(
      req.body,
      {
        where: { id: reviewId },
        returning: true,
      }
    );
    if (numberOfUpdatedReviews === 1) {
      res.send(updatedReviews[0]);
    } else {
      next(createHttpError(404, `Review with id ${reviewId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const numberOfDeletedReviews = await Review.destroy({
      where: { id: reviewId },
    });
    if (numberOfDeletedReviews) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Review with id ${reviewId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
export default reviewsRouter;
