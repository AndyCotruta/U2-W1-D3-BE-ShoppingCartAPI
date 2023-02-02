import express from "express";
import createHttpError from "http-errors";
import UserModel from "../users/model.js";
import ReviewModel from "./model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { reviewId } = await ReviewModel.create(req.body);
    res.status(201).send(`Review with id ${reviewId} was created successfully`);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewModel.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: { model: UserModel },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:reviewId", async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await ReviewModel.findByPk(reviewId);
  if (review) {
    res.send(review);
  } else {
    next(createHttpError(404, `Review with id ${reviewId} not found`));
  }
});

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const [numberOfUpdatedReviews, updatedReviews] = await ReviewModel.update(
      req.body,
      {
        where: { reviewId: reviewId },
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
    const numberOfDeletedReviews = await ReviewModel.destroy({
      where: { reviewId: reviewId },
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
