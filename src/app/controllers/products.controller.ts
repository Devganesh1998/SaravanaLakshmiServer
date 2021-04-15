/* eslint-disable */
import {fireStoreIns} from "../../firebaseIns";
import {Request, Response, Product} from "../../interfaces";

class ProductsController {
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await (
        await fireStoreIns.collection("products").get()
      ).docs.map((doc) => ({...doc.data(), id: doc.id}));
      return res.send({products: products || []});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }

  async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: Product = req.body;
      const {id, email, phoneNo}: any = req.user;
      const product = await fireStoreIns
          .collection("products")
          .add({
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: phoneNo || email || id,
          });
      return res.send({message: "Product added", id: product.id});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: Product = req.body;
      const {id, createdAt, createdBy, ...rest} = productData;
      const productId: string = req.params.productId;
      if (!productId) {
        return res
            .status(400)
            .json({
              message:
              "Field 'id' of the product is required at URL path to update",
            });
      }
      await fireStoreIns
          .collection("products")
          .doc(productId)
          .update({...rest, updatedAt: new Date()});
      return res.send({message: "Product updated", id: productId});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId: string = req.params.productId;
      if (!productId) {
        return res
            .status(400)
            .json({
              message:
              "Field 'id' of the product is required at URL path to delete",
            });
      }
      await fireStoreIns.collection("products").doc(productId).delete();
      return res.send({message: "Product deleted", id: productId});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId: string = req.params.productId;
      if (!productId) {
        return res
            .status(400)
            .json({
              message:
              "Field 'id' of the product is required at URL path to get",
            });
      }
      const product = await fireStoreIns
          .collection("products")
          .doc(productId)
          .get();
      if (product.exists) {
        return res.send({...product.data(), id: product.id});
      }
      return res
          .status(404)
          .json({message: "No product found with the given productId"});
    } catch (err) {
      console.error(err);
      return res.status(500).json({message: "Internal Server Error"});
    }
  }
}

export default new ProductsController();
