import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export const compressAndSaveFile = async (
  file: Express.Multer.File,
  uploadPath: string,
): Promise<string> => {
  const timestamp = Date.now();
  const safeName = file.originalname
    .replace(/\s+/g, '-')
    .replace(/[^\w.-]/g, '');

  let filename = `${timestamp}-${safeName}`;
  let buffer = file.buffer;

  try {
    if (file.mimetype.startsWith('image')) {
      filename = `${timestamp}-${safeName.split('.')[0]}.jpg`;

      buffer = await sharp(file.buffer, {
        failOnError: false, // 🔑 prevents crash on broken images
      })
        .rotate()
        .flatten({ background: '#ffffff' }) // removes alpha safely
        .jpeg({
          quality: 30,
          mozjpeg: true,
        })
        .toBuffer();
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadPath, filename), buffer);

    return filename;
  } catch (err: any) {
    console.error('Sharp failed, saving original file:', err.message);

    // 🔥 HARD FALLBACK (never fail request)
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadPath, filename), file.buffer);

    return filename;
  }
};
export const deleteFile = (filename: string, uploadPath: string) => {
  const filePath = path.join(uploadPath, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
