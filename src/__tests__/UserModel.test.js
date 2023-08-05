import mongoose from "mongoose";
import {
  createNewAdmin,
  getWishlist,
  removeFromWishlist,
  updateAdmin,
  getOneAdminUser,
  addToWishlist,
} from "../models/user/UserModel.js";
import AdminSchema from "../models/user/UserSchema.js";

describe("createNewAdmin function", () => {
  // Tests that createNewAdmin function throws an error when creating a new admin with missing required fields
  it("should throw an error when creating a new admin with missing required fields", async () => {
    await expect(
      createNewAdmin({
        password: "password",
        firstName: "John",
        lastName: "Doe",
      })
    ).rejects.toThrow();
  });

  // Tests that createNewAdmin function throws an error when creating a new admin with invalid data types
  it("should throw an error when creating a new admin with invalid data types", async () => {
    await expect(
      createNewAdmin({
        email: 123,
        password: "password",
        firstName: "John",
        lastName: "Doe",
      })
    ).rejects.toThrow();
  });
});

describe("getWishlist function", () => {
  // Tests that an error is thrown when the filter is not an object
  it("should throw an error when the filter is not an object", async () => {
    await expect(getWishlist("123")).rejects.toThrow();
  });
});

describe("removeFromWishlist function", () => {
  // Tests that removeFromWishlist throws an error if productId is not a valid ObjectId
  it("should throw an error when productId is not a valid ObjectId", async () => {
    const filter = { _id: new mongoose.Types.ObjectId() };
    const productId = "invalid";
    await expect(removeFromWishlist(filter, productId)).rejects.toThrow();
  });
});

describe("updateAdmin function", () => {
  it("should successfully update an admin user", async () => {
    const filter = { _id: "validId" };
    const updateObject = { name: "NewName" };
    const mockAdmin = { _id: "validId", name: "NewName" };
    jest.spyOn(AdminSchema, "findOneAndUpdate").mockResolvedValue(mockAdmin);
    const result = await updateAdmin(filter, updateObject);
    expect(result).toEqual(mockAdmin);
  });
});

describe("getOneAdminUser function", () => {
  it("should successfully fetch one admin user", async () => {
    const filter = { _id: "validId" };
    const mockAdmin = { _id: "validId", name: "AdminName" };
    jest.spyOn(AdminSchema, "findOne").mockResolvedValue(mockAdmin);
    const result = await getOneAdminUser(filter);
    expect(result).toEqual(mockAdmin);
  });
});

describe("addToWishlist function", () => {
  it("should successfully add a product to the wishlist", async () => {
    const filter = { _id: "validId" };
    const productId = "product1";
    const mockAdmin = { _id: "validId", wishlist: ["product1"] };
    jest.spyOn(AdminSchema, "findOneAndUpdate").mockResolvedValue(mockAdmin);
    const result = await addToWishlist(filter, productId);
    expect(result).toEqual(mockAdmin);
  });
});
