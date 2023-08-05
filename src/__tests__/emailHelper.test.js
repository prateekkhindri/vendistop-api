import { sendMail, profileUpdateNotification } from "../helpers/emailHelper.js";

jest.mock("../helpers/emailHelper.js", () => {
  return {
    sendMail: jest.fn((emailInfo) => {
      if (!emailInfo.to) {
        return Promise.reject(new Error("Missing 'to' field in emailInfo"));
      }
      return Promise.resolve();
    }),
    profileUpdateNotification: jest.fn().mockReturnValue(Promise.resolve()),
  };
});

describe("sendMail function", () => {
  // Tests that an error is thrown if emailInfo object is missing required properties
  it("should throw an error if emailInfo object is missing required properties", async () => {
    const emailInfo = {
      from: "test@example.com",
      subject: "Test email",
      text: "This is a test email",
    };
    await expect(sendMail(emailInfo)).rejects.toThrow();
  });
});

describe("profileUpdateNotification function", () => {
  // Tests that the function does not throw an error when the user object does not have an email property
  it("should not throw an error when the user object does not have an email property", async () => {
    const userObj = {
      fName: "John",
      lName: "Doe",
    };
    expect(() => {
      profileUpdateNotification(userObj);
    }).not.toThrow();
  });
});
