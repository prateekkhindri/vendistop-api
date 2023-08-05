import { generateImageKey } from "../utils/imageKeyGenerator.js";

describe("generateImageKey function", () => {
  // Tests that a valid image object generates a correct image key
  it("should generate a correct image key when given a valid image object", () => {
    const image = { name: "test.jpg" };
    const result = generateImageKey(image);
    expect(result).toMatch(/^fileupload\/product-\d+-test.jpg$/);
  });

  // Tests that different image names generate unique image keys
  it("should generate unique image keys for different image names", () => {
    const image1 = { name: "test1.jpg" };
    const image2 = { name: "test2.jpg" };
    const result1 = generateImageKey(image1);
    const result2 = generateImageKey(image2);
    expect(result1).not.toEqual(result2);
  });

  // Tests that an image name as an empty string generates an image key with the correct format
  it("should generate an image key with the correct format when given an image name as an empty string", () => {
    const image = { name: "" };
    const result = generateImageKey(image);
    expect(result).toMatch(/^fileupload\/product-\d+-$/);
  });

  // Tests that an image name as null generates an image key with the correct format
  it("should generate an image key with the correct format when given an image name as null", () => {
    const image = { name: null };
    const result = generateImageKey(image);
    expect(result).toMatch(/^fileupload\/product-\d+-null$/);
  });

  // Tests that an image name as undefined generates an image key with the correct format
  it("should generate an image key with the correct format when given an image name as undefined", () => {
    const image = { name: undefined };
    const result = generateImageKey(image);
    expect(result).toMatch(/^fileupload\/product-\d+-undefined$/);
  });
});
