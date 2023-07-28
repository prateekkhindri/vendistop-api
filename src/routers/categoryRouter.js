import express from "express";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../middlewares/validationMiddleware.js";
import {
  addNewCategory,
  deleteCategoriesByIds,
  getCategoryById,
  readCategories,
  updateCategoryById,
} from "../models/category/CategoryModel.js";
import slugify from "slugify";
import { adminAuth } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Add a Category
router.post(
  "/",
  adminAuth,
  createCategoryValidation,
  async (req, res, next) => {
    try {
      req.body.slug = slugify(req.body.name, {
        lower: true,
        trim: true,
      });

      const result = await addNewCategory(req.body);

      result?.id
        ? res.json({
            status: "success",
            message: `Category ${result.name} has been added successfully`,
            result,
          })
        : res.json({
            status: "error",
            message:
              "Unable to add category at this time, please try again later",
          });
    } catch (error) {
      error.status = 500;

      if (error.message.includes("E11000 duplicate key error collection")) {
        (error.status = 200),
          (error.message =
            "This category already exists, please use a different category name");
      }

      next(error);
    }
  }
);

// Get all categories/single as per the _id
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = _id ? await getCategoryById(_id) : await readCategories();

    res.json({
      status: "success",
      message: "Categories fetched successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
});

// Update a single category - here we can update everything except the slug
router.put("/", adminAuth, updateCategoryValidation, async (req, res, next) => {
  try {
    console.log(req.body);

    const result = await updateCategoryById(req.body);

    result?._id
      ? res.json({
          status: "success",
          message: `Category ${result.name} has been updated successfully`,
        })
      : res.json({
          status: "error",
          message:
            "Unable to update the category at this time, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

// Delete categories
router.delete("/", adminAuth, async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await deleteCategoriesByIds(ids);
    console.log(result);

    result?.deletedCount
      ? res.json({
          status: "success",
          message: "Category has been deleted successfully",
        })
      : res.json({
          status: "error",
          message:
            "Unable to delete the category at this time, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
