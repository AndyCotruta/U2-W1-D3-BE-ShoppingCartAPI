import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect, syncModels } from "./db/db.js";
import productsRouter from "./services//products/index.js";
import categoriesRouter from "./services/categories/index.js";
import usersRouter from "./services/users/index.js";
import reviewsRouter from "./services/reviews/index.js";
import cartRouter from "./services/cart/index.js";

const server = express();

const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/products", productsRouter);
server.use("/categories", categoriesRouter);
server.use("/users", usersRouter);
server.use("/reviews", reviewsRouter);
server.use("/cart", cartRouter);

await pgConnect();
await syncModels();

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is listening on port: ${port}`);
});
