export const generateImageKey = (image) => {
  const str = `fileupload/product-${Date.now()}-${image.name}`;
  return str;
};
