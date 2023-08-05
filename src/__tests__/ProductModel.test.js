import {
  insertProduct,
  getOneProduct,
  getMultipleProducts,
  updateProductById,
  deleteOneProduct,
  updateProduct,
  deleteMultipleProducts,
} from "../models/products/ProductModel.js";
import ProductSchema from "../models/products/ProductSchema.js";

describe("insertProduct function", () => {
  // Tests that insertProduct throws an error when inserting a new product with missing required fields
  it("should throw an error when inserting a new product with missing required fields", async () => {
    const product = {
      name: "Test Product",
      price: 10.99,
      category: "Test Category",
    };
    await expect(insertProduct(product)).rejects.toThrow();
  });

  // Tests that insertProduct throws an error when inserting a new product with invalid field types
  it("should throw an error when inserting a new product with invalid field types", async () => {
    const product = {
      name: "Test Product",
      description: 123,
      price: "10.99",
      category: "Test Category",
    };
    await expect(insertProduct(product)).rejects.toThrow();
  });
});

describe("getOneProduct function", () => {
  // Tests that an invalid filter object throws an error
  it("should throw an error when an invalid filter object is provided", async () => {
    const filter = "invalid filter";
    await expect(getOneProduct(filter)).rejects.toThrow();
  });
});

describe("getMultipleProducts function", () => {
  // Tests that the function returns an error when filter is not an object
  it("should return an error when filter is not an object", async () => {
    const filter = "name: Product 1";
    await expect(getMultipleProducts(filter)).rejects.toThrow();
  });

  // Tests that the function returns an error when there is an issue with the database connection
  it("should return an error when there is an issue with the database connection", async () => {
    const filter = { name: "Product 1" };
    // Simulate a database connection error
    ProductSchema.find = jest
      .fn()
      .mockRejectedValue(new Error("Database connection error"));
    await expect(getMultipleProducts(filter)).rejects.toThrow(
      "Database connection error"
    );
  });
});

describe("updateProductById function", () => {
  // Tests that updateProductById does not update a product with invalid _id
  it("should not update a product with invalid _id", async () => {
    // Arrange
    const updateObj = {
      name: "Updated Test Product",
      price: 20,
      description: "Updated Test Description",
    };

    // Act & Assert
    await expect(updateProductById("invalid_id", updateObj)).rejects.toThrow();
  });
});

describe("deleteOneProduct function", () => {
  // Tests that deleteOneProduct function throws an error when the product is not found
  it("should throw an error when the product is not found", async () => {
    const filter = { _id: "invalidId" };
    jest.spyOn(ProductSchema, "findOne").mockResolvedValue(null);
    await expect(deleteOneProduct(filter)).rejects.toThrow("Product not found");
  });
});

describe("updateProduct function", () => {
  it("should successfully update a product", async () => {
    const filter = { _id: "validId" };
    const updateObject = { name: "NewName" };
    const mockProduct = { _id: "validId", name: "NewName" };
    jest
      .spyOn(ProductSchema, "findOneAndUpdate")
      .mockResolvedValue(mockProduct);
    const result = await updateProduct(filter, updateObject);
    expect(result).toEqual(mockProduct);
  });
});

describe("deleteMultipleProducts function", () => {
  it("should successfully delete multiple products", async () => {
    const ids = ["id1", "id2"];
    const mockResult = { deletedCount: 2 };
    jest.spyOn(ProductSchema, "deleteMany").mockResolvedValue(mockResult);
    const result = await deleteMultipleProducts(ids);
    expect(result).toEqual(mockResult);
  });
});
