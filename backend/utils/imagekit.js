// utils/imagekit.js
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Uploads a single in-memory file buffer to ImageKit and returns its URL.
// Called BEFORE any Mongo transaction starts — an external network call
// has no place inside a DB transaction. If this throws, registration
// fails before any DB writes happen, so nothing needs rolling back.
export async function uploadImageToImageKit(fileBuffer, fileName, folder) {
  const result = await imagekit.upload({
    file: fileBuffer,
    fileName,
    folder,
    useUniqueFileName: true,
  });
  return result.url;
}

export default imagekit;