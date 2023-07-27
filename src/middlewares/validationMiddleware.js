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
    // dob: DOB,
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

// Update admin profile validation
export const updateAdminProfileValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: FNAME,
    lName: LNAME,
    // dob: DOB,
    phone: PHONE,
    address: ADDRESS,
    email: EMAIL,
    currentPassword: PASSWORD,
  });

  joiValidator(schema, req, res, next);
};
