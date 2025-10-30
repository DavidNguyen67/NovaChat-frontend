/* eslint-disable prettier/prettier */
export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: any,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.src = imageSrc;
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject('Canvas not supported');

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      const base64Image = canvas.toDataURL('image/png');

      resolve(base64Image);
    };
    image.onerror = reject;
  });
};
