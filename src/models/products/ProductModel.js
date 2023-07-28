import { S3UploadHelper } from "../../helpers/S3UploadHelper.js";
import { generateImageKey } from "../../utils/imageKeyGenerator.js";
import ProductSchema from "./ProductSchema.js";

// Add a new product query
export const insertProduct = async (obj) => {
  return ProductSchema(obj).save();
};

// Get single product - filter must be an object
export const getOneProduct = (filter) => {
  return ProductSchema.findOne(filter);
};

// Get multiple products - filter must be an object
export const getMultipleProducts = (filter) => {
  return ProductSchema.find(filter);
};

// Update product by _id
export const updateProductById = async (_id, updateObj) => {
  if (updateObj.image) {
    console.log({ _id });
    const product = await ProductSchema.findById(_id);
    await S3UploadHelper.deleteFile(product.imageKey);
    updateObj.imageKey = generateImageKey(updateObj.image);
    console.log({ key1: product.imageKey, key2: updateObj.imageKey });
    const newImage = await S3UploadHelper.uploadFile(
      updateObj.image,
      updateObj.imageKey
    );
    updateObj.image = newImage.Location;
  }

  // Update the product document in the database
  return ProductSchema.findByIdAndUpdate(_id, updateObj, { new: true });
};

// Update Product
export const updateProduct = (filter, obj) => {
  return ProductSchema.findOneAndUpdate(filter, obj);
};

// Delete one product
export const deleteOneProduct = async (filter) => {
  // Fetch the product
  const product = await ProductSchema.findOne(filter);

  if (!product) {
    throw new Error("Product not found");
  }

  // Delete image from S3
  await S3UploadHelper.deleteFile(product.imageKey);

  // Delete the product document from the database
  return product.deleteOne();
};

// Delete multiple products
export const deleteMultipleProducts = (ids) => {
  return ProductSchema.deleteMany({ _id: { $in: ids } });
};
