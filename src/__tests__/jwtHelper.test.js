import {
  signAccessJWT,
  signRefreshJWT,
  createJWTs,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../helpers/jwtHelper.js";

describe("signAccessJWT function", () => {
  // Tests that signAccessJWT throws an error when JWT_ACCESS_SECRET is an empty string
  it("should throw an error when JWT_ACCESS_SECRET is an empty string", async () => {
    process.env.JWT_ACCESS_SECRET = "";
    const payload = { id: 1 };
    await expect(signAccessJWT(payload)).rejects.toThrow();
  });
});

describe("signRefreshJWT function", () => {
  // Tests that signRefreshJWT throws an error if payload is missing email
  it("should throw an error if payload is missing email", async () => {
    const payload = {};
    await expect(signRefreshJWT(payload)).rejects.toThrow();
  });
});

describe("createJWTs function", () => {
  // Tests that the function throws an error when payload is null
  it("should throw an error when payload is null", async () => {
    await expect(createJWTs(null)).rejects.toThrow();
  });
});

describe("verifyAccessJWT function", () => {
  // Tests that an invalid access JWT token returns an error message
  it("should return an error message for an invalid access JWT token", () => {
    const token = "invalid_token";
    const error = verifyAccessJWT(token);
    expect(error).toBe("jwt malformed");
  });

  // Tests that a malformed access JWT token returns an error message
  it("should return an error message for a malformed access JWT token", () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const error = verifyAccessJWT(token);
    expect(error).toBe("jwt malformed");
  });
});

describe("verifyRefreshJWT function", () => {
  // Tests that an invalid refresh JWT token returns an error message
  it("should return an error message when an invalid refresh JWT token is provided", () => {
    const token = "invalid_token";
    const error = verifyRefreshJWT(token);
    expect(error).toBe("jwt malformed");
  });

  // Tests that a null token returns an error message
  it("should return an error message when a null token is provided", () => {
    const token = null;
    const error = verifyRefreshJWT(token);
    expect(error).toBe("jwt must be provided");
  });
});
