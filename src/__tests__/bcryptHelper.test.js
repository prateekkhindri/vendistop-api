import { hashedPassword, comparePassword } from "../helpers/bcryptHelper.js";

describe("Bcrypt helper functions", () => {
  it("hashedPassword should return a hashed password", () => {
    const password = "testpassword";
    const hashed = hashedPassword(password);
    expect(hashed).not.toEqual(password);
  });

  it("comparePassword should correctly compare a plaintext password and its hash", () => {
    const password = "testpassword";
    const hashed = hashedPassword(password);
    const isValid = comparePassword(password, hashed);
    expect(isValid).toBe(true);
  });
});
