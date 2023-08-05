import AWS from "aws-sdk";
import { S3UploadHelper } from "../helpers/S3UploadHelper.js";

jest.mock("aws-sdk", () => {
  const S3 = { upload: jest.fn(), deleteObject: jest.fn() };
  S3.upload.mockImplementation(() => S3);
  S3.deleteObject.mockImplementation(() => S3);
  S3.promise = jest.fn();
  return { S3: jest.fn(() => S3) };
});

describe("S3UploadHelper", () => {
  const file = { data: "file data" };
  const imageKey = "imageKey";

  beforeEach(() => {
    AWS.S3().upload.mockClear();
    AWS.S3().deleteObject.mockClear();
    AWS.S3().promise.mockClear();
  });

  it("should upload a file", async () => {
    await S3UploadHelper.uploadFile(file, imageKey);
    expect(AWS.S3().upload).toHaveBeenCalledWith({
      Bucket: process.env.AWS_BUCKET,
      Key: imageKey,
      Body: file.data,
      ACL: "public-read",
    });
  });

  it("should update a file", async () => {
    await S3UploadHelper.updateFile(imageKey, file);
    expect(AWS.S3().deleteObject).toHaveBeenCalledWith({
      Bucket: process.env.AWS_BUCKET,
      Key: imageKey,
    });
    expect(AWS.S3().upload).toHaveBeenCalled();
  });

  it("should delete a file", async () => {
    await S3UploadHelper.deleteFile(imageKey);
    expect(AWS.S3().deleteObject).toHaveBeenCalledWith({
      Bucket: process.env.AWS_BUCKET,
      Key: imageKey,
    });
  });
});
