import {
  insertSession,
  getSession,
  deleteSession,
} from "../models/sessions/SessionModel.js";
import SessionSchema from "../models/sessions/SessionSchema.js";

describe("insertSession function", () => {
  // Tests that insertSession throws an error when inserting a session object with missing required fields
  it("should throw an error when inserting a session object with missing required fields", async () => {
    const session = {
      expires: new Date(),
      accessToken: "abc123",
      refreshToken: "def456",
    };
    await expect(insertSession(session)).rejects.toThrow();
  });

  // Tests that insertSession throws an error when inserting a session object with invalid data types
  it("should throw an error when inserting a session object with invalid data types", async () => {
    const session = {
      userId: 1234567890,
      expires: "invalid date",
      accessToken: "abc123",
      refreshToken: "def456",
    };
    await expect(insertSession(session)).rejects.toThrow();
  });
});

describe("getSession function", () => {
  // Tests that getSession function successfully retrieves a session
  it("should successfully retrieve a session", async () => {
    const filter = { _id: "validId" };
    const mockSession = { _id: "validId", data: "some data" };
    jest.spyOn(SessionSchema, "findOne").mockResolvedValue(mockSession);
    const result = await getSession(filter);
    expect(result).toEqual(mockSession);
  });

  // Tests that getSession function returns null when the session is not found
  it("should return null when the session is not found", async () => {
    const filter = { _id: "invalidId" };
    jest.spyOn(SessionSchema, "findOne").mockResolvedValue(null);
    const result = await getSession(filter);
    expect(result).toBeNull();
  });
});

describe("deleteSession function", () => {
  // Tests that deleteSession function successfully deletes a session
  it("should successfully delete a session", async () => {
    const filter = { _id: "validId" };
    const mockSession = { _id: "validId", data: "some data" };
    jest
      .spyOn(SessionSchema, "findOneAndDelete")
      .mockResolvedValue(mockSession);
    const result = await deleteSession(filter);
    expect(result).toEqual(mockSession);
  });

  // Tests that deleteSession function returns null when the session is not found
  it("should return null when the session is not found", async () => {
    const filter = { _id: "invalidId" };
    jest.spyOn(SessionSchema, "findOneAndDelete").mockResolvedValue(null);
    const result = await deleteSession(filter);
    expect(result).toBeNull();
  });
});
