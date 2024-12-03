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
