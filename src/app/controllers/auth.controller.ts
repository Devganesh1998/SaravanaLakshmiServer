/* eslint-disable */
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { fireStoreIns } from "../../firebaseIns";
import { Request, Response } from "../../interfaces";
import SECRETS from "../utils/getSecrets";

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { phoneNo: reqPhoneNo, email: reqEmail, password } = req.body;
      const query = await fireStoreIns
        .collection("users")
        .where(
          reqPhoneNo ? "phoneNo" : "email",
          "==",
          reqPhoneNo ? reqPhoneNo : reqEmail
        )
        .get();
      if (!query.empty) {
        const snapshot = query.docs[0];
        const {
          password: dbPassword,
          status,
          email,
          phoneNo,
          isAdmin,
        } = snapshot.data();
        const userId = snapshot.id;
        if (status === "DISABLED") {
          return res
            .status(400)
            .json({
              message:
                "User with given email or phoneNo is disabled",
            });
        } else {
          const isMatch: boolean = await bcrypt.compare(
            password,
            dbPassword
          );
          if (isMatch) {
            const token = jwt.sign(
              { id: userId, email, phoneNo, isAdmin },
              SECRETS.JWTSECRET
            );
            res.cookie("saraLak", token, {
              httpOnly: true,
              sameSite: true,
              maxAge: 1000 * 60 * 60 * 8
            });
            return res.send({ message: "Login successfull" });
          } else {
            return res
              .status(400)
              .json({
                message: "Given credentials are incorrect",
              });
          }
        }
      } else {
        return res
          .status(404)
          .json({
            message:
              "User with given email or phoneNo hasn't registered yet",
          });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("saraLak");
      return res.send({ message: "Logged out successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new AuthController();
