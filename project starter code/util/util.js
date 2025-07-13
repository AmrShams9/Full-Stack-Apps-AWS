import fs from "fs";
import path from "path";
import Jimp from "jimp";

export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);

      // create tmp folder if not exist
      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
      }

      const outpath = path.join(tmpDir, "filtered." + Math.floor(Math.random() * 2000) + ".jpg");

      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (err) => {
          if (err) return reject(err);
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteLocalFiles(files) {
  for (let file of files) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}
