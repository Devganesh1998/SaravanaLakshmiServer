/* eslint-disable */
import * as express from "express";
import productController from "../controllers/products.controller";
import {authCheck} from "../customMiddlewares/authCheck.middleware";

const router = express.Router();

router
    .route("/")
    .get(authCheck("USER"), productController.getAllProducts)
    .post(authCheck("ADMIN"), productController.addProduct);

router
    .route("/:productId")
    .get(authCheck("USER"), productController.getProductById)
    .put(authCheck("ADMIN"), productController.updateProduct)
    .delete(authCheck("ADMIN"), productController.deleteProduct);

export default router;
