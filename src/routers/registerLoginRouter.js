import express from "express";
import {
  adminLoginValidation,
  adminRegistrationValidation,
  resetPasswordValidation,
} from "../middlewares/validationMiddleware.js";
import { comparePassword, hashedPassword } from "../helpers/bcryptHelper.js";
import {
  createNewAdmin,
  getOneAdminUser,
  updateAdmin,
} from "../models/user/UserModel.js";
import {
  passwordResetOTP,
  profileUpdateNotification,
} from "../helpers/emailHelper.js";
import { randomNumberGenerator } from "../utils/randomGenerator.js";
import {
  deleteSession,
  insertSession,
} from "../models/sessions/SessionModel.js";
import { createJWTs } from "../helpers/jwtHelper.js";

const router = express.Router();

// User registration endpoint
router.post("/", adminRegistrationValidation, async (req, res, next) => {
  try {
    // Encrypt the password
    req.body.password = hashedPassword(req.body.password);

    // Call the model to run the save query
    const result = await createNewAdmin(req.body);

    if (result?._id) {
      return res.json({
        status: "success",
        message: "Registration successful, please proceed to login",
      });
    }

    res.json({
      status: "success",
      message: "Unable to register at this time, please try again later",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.status = 200;
      error.message =
        "This email is already registered, please try using a different email";
    }
    next(error);
  }
});

// User Login endpoint
router.post("/login", adminLoginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await getOneAdminUser({ email });

    if (result?._id) {
      // Check if the password from the db and the one being received from the frontend matches
      const isMatched = comparePassword(password, result.password);

      // Do not send the password to the frontend
      result.password = undefined;
      result.refreshJWT = undefined;

      if (isMatched) {
        const tokens = await createJWTs({ email });

        return res.json({
          status: "success",
          message: "Login Successful",
          result,
          ...tokens,
        });
      }
    }

    res.json({
      status: "error",
      message: "Invalid login credentials",
    });
  } catch (error) {
    next(error);
  }
});

// Request OTP for the password reset
router.post("/otp-request", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email.length > 4 && email.length < 50) {
      // Find if the user email exists in the db
      const user = await getOneAdminUser({ email });

      if (user?._id) {
        // Generate a random 6 digit OTP
        const otpLength = 6;
        const otp = randomNumberGenerator(otpLength);

        const obj = {
          token: otp,
          associate: email,
          type: "updatePassword",
        };
        const result = await insertSession(obj);

        if (result?._id) {
          // Send the OTP to the users email
          const emailInfo = {
            fName: user.fName,
            email: user.email,
            otp,
          };
          passwordResetOTP(emailInfo);
        }
      }
    }

    res.json({
      status: "success",
      message:
        "If this email exists in our system, we will send you an OTP. Please check your email and follow the instructions",
    });
  } catch (error) {
    next(error);
  }
});

// Reset the new password
router.patch("/password", resetPasswordValidation, async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const filter = {
      token: otp,
      associate: email,
      type: "updatePassword",
    };
    // First check if the OTP and email combinations exist in the db and delete
    const isDeleted = await deleteSession(filter);

    if (isDeleted?._id) {
      // Encrypt the password
      const obj = {
        password: hashedPassword(password),
      };

      // Update the password in the user table
      const result = await updateAdmin({ email }, obj);

      if (result?._id) {
        // Send an email notification with password reset update
        profileUpdateNotification(result);
        return res.json({
          status: "success",
          message: "Password has been updated successfully, you may login now",
        });
      }
    }

    res.json({
      status: "error",
      message: "Unable to reset password at this time, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
