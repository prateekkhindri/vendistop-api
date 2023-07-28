import Joi from "joi";
import {
  ADDRESS,
  DATE,
  DOB,
  EMAIL,
  FNAME,
  joiValidator,
  LNAME,
  LONGSTR,
  OTP,
  PASSWORD,
  PHONE,
  PRICE,
  QTY,
  SHORTSTR,
  STATUS,
  TOPPRODUCT,
} from "./validationConstant.js";

// Registration and Login middlewares
export const adminRegistrationValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: FNAME,
    lName: LNAME,
    phone: PHONE,
    email: EMAIL,
    password: PASSWORD,
    address: ADDRESS,
  });

  joiValidator(schema, req, res, next);
};

export const adminLoginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    password: PASSWORD,
  });

  joiValidator(schema, req, res, next);
};

// Reset password validation for a registered user
export const resetPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    otp: OTP.required(),
    password: PASSWORD,
  });

  joiValidator(schema, req, res, next);
};

// Update password validation for a logged in user
export const updateAdminPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    currentPassword: PASSWORD,
    password: PASSWORD,
  });

  joiValidator(schema, req, res, next);
};

// Update profile validation for a logged in user
export const updateAdminProfileValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: FNAME,
    lName: LNAME,
    phone: PHONE,
    address: ADDRESS,
    email: EMAIL,
    currentPassword: PASSWORD,
  });

  joiValidator(schema, req, res, next);
};

// Categories Validation

// Add new category validation
export const createCategoryValidation = (req, res, next) => {
  req.body.parentCatId = req.body.parentCatId ? req.body.parentCatId : null;
  const schema = Joi.object({
    name: SHORTSTR.required(),
    parentCatId: SHORTSTR.allow(null),
  });

  joiValidator(schema, req, res, next);
};

// Update category validation
export const updateCategoryValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTSTR.required(),
    name: SHORTSTR.required(),
    parentCatId: SHORTSTR.allow(null, ""),
  });

  joiValidator(schema, req, res, next);
};

// Product Validation
export const newProductValidation = (req, res, next) => {
  const schema = Joi.object({
    name: SHORTSTR.required(),
    description: SHORTSTR.required(),
    details: LONGSTR.required(),
    price: PRICE.required(),
    catId: SHORTSTR.allow("", null),
    topProduct: TOPPRODUCT,
  });

  joiValidator(schema, req, res, next);
};

export const updateProductValidation = (req, res, next) => {
  const schema = Joi.object({
    name: SHORTSTR.required(),
    description: SHORTSTR.required(),
    details: LONGSTR.required(),
    price: PRICE.required(),
    topProduct: TOPPRODUCT,
    catId: SHORTSTR.allow("", null),
  });

  joiValidator(schema, req, res, next);
};
