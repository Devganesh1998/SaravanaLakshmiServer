/* tslint:disable */
import * as jwt from "jsonwebtoken";
import {Request, Response} from "../../interfaces";
import SECRETS from "../utils/getSecrets";

export const authCheck = (userType: string) => {
  return (req: Request, res: Response, next: Function) => {
    const saraLakCookie = req.cookies.saraLak;
    if (saraLakCookie) {
      const {id, email, phoneNo, isAdmin}: any = jwt.verify(
          saraLakCookie,
          SECRETS.JWTSECRET
      );
      if (userType === "ADMIN") {
        if (!isAdmin) {
          return res
              .status(401)
              .json({
                message: "This endpoint requires admin access",
              });
        } else {
          req.user = {id, email, phoneNo, isAdmin};
          return next();
        }
      } else {
        if (id) {
          req.user = {id, email, phoneNo, isAdmin};
          next();
        } else {
          return res
              .status(401)
              .json({message: "Unauthorized request"});
        }
      }
    } else {
      return res
          .status(401)
          .json({message: "Unauthorized request, Please login."});
    }
  };
};
