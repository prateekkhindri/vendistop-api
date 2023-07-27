import SessionSchema from "./SessionSchema.js";

// CREATE
export const insertSession = (obj) => {
  return SessionSchema(obj).save();
};

// READ - filter must be an object
export const getSession = (filter) => {
  return SessionSchema.findOne(filter);
};

// DELETE
export const deleteSession = (filter) => {
  return SessionSchema.findOneAndDelete(filter);
};
