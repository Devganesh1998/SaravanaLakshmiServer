/* eslint-disable */
import * as express from "express";
import productsRouter from "./products.router";
import authRouter from "./auth.routes";
import userRouter from "./users.routes";

const router = express.Router();

router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
