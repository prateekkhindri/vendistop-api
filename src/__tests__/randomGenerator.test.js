import { randomNumberGenerator } from "../utils/randomGenerator.js";

describe("generateImageKey function", () => {
  // Tests that a random number of length 1 is generated
  it("should generate a random number of length 1", () => {
    const result = randomNumberGenerator(1);
    expect(result.length).toBe(1);
  });

  // Tests that a random number of length 5 is generated
  it("should generate a random number of length 5", () => {
    const result = randomNumberGenerator(5);
    expect(result.length).toBe(5);
  });

  // Tests that a random number of length 10 is generated
  it("should generate a random number of length 10", () => {
    const result = randomNumberGenerator(10);
    expect(result.length).toBe(10);
  });

  // Tests that an empty string is returned when length is 0
  it("should return an empty string when length is 0", () => {
    const result = randomNumberGenerator(0);
    expect(result).toBe("");
  });

  // Tests that a random number of length 1000000 is generated
  it("should generate a random number of length 1000000", () => {
    const result = randomNumberGenerator(1000000);
    expect(result.length).toBe(1000000);
  });

  // Tests that a random number of length 1 with only one possible value is generated
  it("should generate a random number of length 1 with only one possible value", () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    const result = randomNumberGenerator(1);
    expect(result).toBe("5");
  });
});
