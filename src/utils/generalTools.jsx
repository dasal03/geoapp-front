export const convertImageToBase64 = (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(imageFile);
  });
};

export const base64ToImage = (base64String, fileName = "image.png") => {
  return fetch(base64String)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], fileName, { type: blob.type });
      return file;
    })
    .catch((error) => {
      throw new Error("Error al convertir base64 a imagen: " + error.message);
    });
};

export const getCroppedImg = (imageSrc, pixelCrop) => {
  const canvas = document.createElement("canvas");
  const image = new Image();
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
};

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export const capitalizeText = (text) => {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};
