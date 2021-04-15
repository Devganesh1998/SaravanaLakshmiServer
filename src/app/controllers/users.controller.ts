/* eslint-disable */
import * as bcrypt from "bcrypt";
import {fireStoreIns} from "../../firebaseIns";
import {Request, Response, User} from "../../interfaces";

class UsersController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await (
        await fireStoreIns.collection("users").get()
      ).docs.map((doc) => {
        const {password, ...userData}: any = doc.data();
        return {...userData, id: doc.id};
      });
      return res.send({users: users || []});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }

  async addUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: User = req.body;
      const {id, email, phoneNo}: any = req.user;
      const hashedPassword = await bcrypt.hash(userData.password, 8);
      const user = await fireStoreIns
          .collection("users")
          .add({
            ...userData,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: phoneNo || email || id,
          });
      return res.send({message: "User added", id: user.id});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: User = req.body;
      const {id, createdAt, createdBy, ...rest} = userData;
      const userId: string = req.params.userId;
      if (!userId) {
        return res
            .status(400)
            .json({
              message:
              "Field 'id' of the user is required at URL path to update user",
            });
      }
      const hashedPassword = await bcrypt.hash(userData.password, 8);
      await fireStoreIns
          .collection("users")
          .doc(userId)
          .update({
            ...rest,
            password: hashedPassword,
            updatedAt: new Date(),
          });
      return res.send({message: "User updated", id: userId});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      if (!userId) {
        return res
            .status(400)
            .json({
              message:
              "Field 'id' of the user is required at URL path to delete user",
            });
      }
      await fireStoreIns.collection("users").doc(userId).delete();
      return res.send({message: "User deleted", id: userId});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      if (!userId) {
        return res
            .status(400)
            .json({
              message:
              "Field 'id' of the user is required at URL path to get user",
            });
      }
      const user = await fireStoreIns
          .collection("users")
          .doc(userId)
          .get();
      if (user.exists) {
        const {password, ...userData}: any = user.data();
        return res.send({...userData, id: user.id});
      }
      return res
          .status(404)
          .json({message: "No User found with the given userId"});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }
}

export default new UsersController();
