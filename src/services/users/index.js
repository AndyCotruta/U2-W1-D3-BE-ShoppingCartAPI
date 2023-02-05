import express from "express";
import createHttpError from "http-errors";
import { Review, User } from "../../db/models/index.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const { userId } = await User.create(req.body);
    res.status(201).send(`User with id ${userId} was created successfully`);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findByPk(userId);
  if (user) {
    res.send(user);
  } else {
    next(createHttpError(404, `User with id ${userId} not found`));
  }
});

usersRouter.get("/:userId/reviews", async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findByPk(userId, {
    include: {
      model: Review,
    },
  });
  if (user) {
    res.send(user);
  } else {
    next(createHttpError(404, `User with id ${userId} not found`));
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [numberOfUpdatedUsers, updatedUsers] = await User.update(req.body, {
      where: { userId: userId },
      returning: true,
    });
    if (numberOfUpdatedUsers === 1) {
      res.send(updatedUsers[0]);
    } else {
      next(createHttpError(404, `User with id ${userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const numberOfDeletedUsers = await User.destroy({
      where: { userId: userId },
    });
    if (numberOfDeletedUsers) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
export default usersRouter;
