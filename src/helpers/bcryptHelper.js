import bcrypt from "bcryptjs";

const salt = 10;

export const hashedPassword = (val) => {
  return bcrypt.hashSync(val, salt);
};

export const comparePassword = (plainPassword, hashPassword) => {
  return bcrypt.compareSync(plainPassword, hashPassword);
};
