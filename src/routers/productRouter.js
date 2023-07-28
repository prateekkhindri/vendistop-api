import express from "express";
import {
  newProductValidation,
  updateProductValidation,
} from "../middlewares/validationMiddleware.js";
import {
  getMultipleProducts,
  insertProduct,
  getOneProduct,
  deleteOneProduct,
  updateProductById,
} from "../models/products/ProductModel.js";
import { S3UploadHelper } from "../helpers/S3UploadHelper.js";
import { generateImageKey } from "../utils/imageKeyGenerator.js";

const router = express.Router();

// Create new product
router.post("/", newProductValidation, async (req, res, next) => {
  try {
    if (req.files) {
      let { image } = req.files;

      const imageKey = generateImageKey(image);

      const imageLocation = (await S3UploadHelper.uploadFile(image, imageKey))
        .Location;

      const newProduct = {
        ...req.body,
        image: imageLocation,
        imageKey,
      };

      const product = await insertProduct(newProduct);

      return product?._id
        ? res.json({
            status: "success",
            message: "New product has been added successfully",
          })
        : res.json({
            status: "error",
            message:
              "Unable to create a new product at this time, please try again later",
          });
    }
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message =
        "Product with the same name already exists, please change the name and try again";
    }
    next(error);
  }
});

// Get the products
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const products = _id
      ? await getOneProduct({ _id })
      : await getMultipleProducts();
    res.json({
      status: "success",
      message: "Products list",
      products,
    });
  } catch (error) {
    next(error);
  }
});

// Update Product
router.put("/:_id", updateProductValidation, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { body } = req;

    if (req.files.image) {
      body.image = req.files.image;
    }

    const product = await updateProductById(_id, body);

    return product?._id
      ? res.json({
          status: "success",
          message: "Product has been updated successfully",
        })
      : res.json({
          status: "error",
          message:
            "Unable to update the product at this time, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

// Delete the product
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const product = await deleteOneProduct({ _id });

    product?._id
      ? res.json({
          status: "success",
          message: "Product has been deleted successfully",
        })
      : res.json({
          status: "error",
          message:
            "Unable to delete the product at this time, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
