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
