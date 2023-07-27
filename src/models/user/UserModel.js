import AdminSchema from "./UserSchema.js";

// Queries

// Create new user
export const createNewAdmin = (obj) => {
  return AdminSchema(obj).save();
};

export const updateAdmin = (filter, obj) => {
  return AdminSchema.findOneAndUpdate(filter, obj, { new: true });
};

// Query to get a user when logging in
// Filter must be an object
export const getOneAdminUser = (filter) => {
  return AdminSchema.findOne(filter);
};

// Wishlist Queries

// Fetch the users wishlist
export const getWishlist = (filter) => {
  return AdminSchema.findOne(filter).populate("wishlist");
};

// Add product to wishlist
export const addToWishlist = (filter, productId) => {
  return AdminSchema.findOneAndUpdate(
    filter,
    { $addToSet: { wishlist: productId } },
    { new: true }
  );
};

// Remove product from wishlist
export const removeFromWishlist = (filter, productId) => {
  return AdminSchema.findOneAndUpdate(
    filter,
    { $pull: { wishlist: productId } },
    { new: true }
  );
};
