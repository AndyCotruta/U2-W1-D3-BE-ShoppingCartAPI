import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect, syncModels } from "./db.js";
import productsRouter from "./products/index.js";
import categoriesRouter from "./categories/index.js";
import usersRouter from "./users/index.js";
import reviewsRouter from "./reviews/index.js";
import shoppingCartRouter from "./shoppingCart/index.js";

const server = express();

const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/products", productsRouter);
server.use("/categories", categoriesRouter);
server.use("/users", usersRouter);
server.use("/reviews", reviewsRouter);
server.use("/shoppingCart", shoppingCartRouter);

await pgConnect();
await syncModels();

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is listening on port: ${port}`);
});
