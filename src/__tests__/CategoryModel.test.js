import {
  addNewCategory,
  updateCategoryById,
  deleteCategoriesByIds,
} from "../models/category/CategoryModel.js";
import CategorySchema from "../models/category/CategorySchema.js";

// Mocking the deleteMany function
CategorySchema.deleteMany = jest.fn().mockResolvedValue({ n: 0 });

// Mocking the addNewCategory function
CategorySchema.addNewCategory = jest.fn().mockImplementation((category) => {
  if (category.name && typeof category.name === "string") {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error("Invalid category"));
  }
});

// Mocking the updateCategoryById function
CategorySchema.updateCategoryById = jest.fn().mockImplementation((category) => {
  if (category._id && typeof category._id === "string") {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error("Invalid id"));
  }
});

describe("addNewCategory function", () => {
  // Tests that addNewCategory throws an error when adding a new category with missing required fields
  it("should throw an error when adding a new category with missing required fields", async () => {
    const category = {
      description: "This is a test category",
    };
    await expect(addNewCategory(category)).rejects.toThrow();
  });

  // Tests that addNewCategory throws an error when adding a new category with invalid field types
  it("should throw an error when adding a new category with invalid field types", async () => {
    const category = {
      name: 123,
      description: "This is a test category",
      image: 456,
    };
    await expect(addNewCategory(category)).rejects.toThrow();
  });
});

describe("updateCategoryById function", () => {
  // Tests that updateCategoryById throws an error when _id is invalid
  it("should throw an error when _id is invalid", async () => {
    await expect(
      updateCategoryById({ _id: "invalid_id", name: "Updated Category" })
    ).rejects.toThrow();
  });
});

describe("deleteCategoriesByIds function", () => {
  // Tests that deleteCategoriesByIds function deletes no categories with empty array of ids
  it("should not delete any categories with empty array of ids", async () => {
    const ids = [];
    const result = await deleteCategoriesByIds(ids);
    expect(CategorySchema.deleteMany).toHaveBeenCalledWith({
      _id: { $in: ids },
    });
    expect(result).toBeTruthy();
  });
});
