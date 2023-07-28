import CategorySchema from "./CategorySchema.js";

// Insert/add a new category
export const addNewCategory = (obj) => {
  return CategorySchema(obj).save();
};

// Read all categories - Fetch/View
export const readCategories = () => {
  return CategorySchema.find();
};

// Read a single category by id
export const getCategoryById = (_id) => {
  return CategorySchema.findById(_id);
};

// Update a single category
export const updateCategoryById = ({ _id, ...obj }) => {
  return CategorySchema.findByIdAndUpdate(_id, obj, { new: true });
};

// Delete Categories (ids must be an array)
export const deleteCategoriesByIds = (ids) => {
  return CategorySchema.deleteMany({ _id: { $in: ids } });
};
