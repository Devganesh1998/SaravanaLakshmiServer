/* eslint-disable */
import * as express from "express";
import authController from "../controllers/auth.controller";
import {authCheck} from "../customMiddlewares/authCheck.middleware";

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/logout").get(authCheck("USER"), authController.logout);
router.route("/authCheck").get(authController.authCheck);

export default router;
