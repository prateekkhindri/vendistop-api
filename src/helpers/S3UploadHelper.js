import AWS from "aws-sdk";

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const S3UploadHelper = {
  uploadFile: async (file, imageKey) => {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: imageKey,
      Body: file.data,
      ACL: "public-read",
    };

    const data = await S3.upload(params).promise();
    return data;
  },

  updateFile: async (key, file) => {
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    };

    await S3.deleteObject(deleteParams).promise();

    const newParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: `fileupload/product-${Date.now()}-${file.name}`,
      Body: file.data,
      ACL: "public-read",
    };
    const data = await S3.upload(newParams).promise();
    return data;
  },

  deleteFile: async (key) => {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    };

    await S3.deleteObject(params).promise();
    return;
  },
};
