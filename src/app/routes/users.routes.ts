/* eslint-disable */
import * as express from "express";
import usersController from "../controllers/users.controller";
import {authCheck} from "../customMiddlewares/authCheck.middleware";

const router = express.Router();

router
    .route("/")
    .get(authCheck("ADMIN"), usersController.getAllUsers)
    .post(authCheck("ADMIN"), usersController.addUser);

router
    .route("/:userId")
    .get(authCheck("ADMIN"), usersController.getUserById)
    .put(authCheck("ADMIN"), usersController.updateUser)
    .delete(authCheck("ADMIN"), usersController.deleteUser);

export default router;
