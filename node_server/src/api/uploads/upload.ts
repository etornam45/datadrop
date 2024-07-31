import { gunzip } from "zlib";
import multer from "multer";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { prisma } from "../utils";
import { createPineconeIndex } from "../../vector/create_index";

export const upload = multer({ storage: multer.memoryStorage() });

function decompressData(compressedData: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    gunzip(compressedData, (err, decompressedData) => {
      if (err) {
        reject(err);
      } else {
        resolve(decompressedData);
      }
    });
  });
}

function saveDataToFile(data: Buffer, filename: string): Promise<void> {
  const uploadsDir = path.join(__dirname, "../../uploads");

  // Validate and sanitize the filename
  const safeFilename = path.basename(filename);
  if (!safeFilename) {
    return Promise.reject(new Error("Invalid filename"));
  }

  const filePath = path.join(uploadsDir, safeFilename);

  return new Promise((resolve, reject) => {
    // Check if the uploads directory exists, create it if it doesn't
    fs.mkdir(uploadsDir, { recursive: true }, (err) => {
      if (err) return reject(err);

      // Now that we know the directory exists, write the file
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

export async function uploadFile(req: Request, res: Response) {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      res.status(400).send(err.message);
      return;
    }
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const decompressedData = await decompressData(file.buffer);
    await saveDataToFile(decompressedData, file.originalname);
    res.status(200).send("File uploaded successfully.");
  });
}

export async function uploadFileMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let userId = req.headers.userId as string ?? req.headers.JWTuserId as string ?? req.headers.userid as string;

  if (!userId) {
    userId = req.headers.JWTuserId as string;
  }

  try {
    const index = await createPineconeIndex(userId);
  } catch (error) {
    console.log("Error creating project: ", error);
  }
  upload.single("file")(req, res, async (err) => {
    if (err) {
      res.status(400).send(err.message);
      return;
    }
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const decompressedData = await decompressData(file.buffer);
    await saveDataToFile(decompressedData, file.originalname);
    res.locals.filename = file.originalname;
    next();
  });
}

export async function uploadFileWithMetadataMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      res.status(400).send(err.message);
      return;
    }
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const decompressedData = await decompressData(file.buffer);
    const metadata = JSON.parse(decompressedData.toString());
    await saveDataToFile(file.buffer, file.originalname);
    res.locals.filename = file.originalname;
    res.locals.metadata = metadata;
    next();
  });
}

export async function uploadMultipleFilesMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let userId = req.headers.userId as string ?? req.headers.JWTuserId as string ?? req.headers.userid as string;

  if (!userId) {
    userId = req.headers.JWTuserId as string;
  }

  upload.array("files")(req, res, async (err) => {
    if (err) {
      res.status(400).send(err.message);
      return;
    }
    const files = req.files as Express.Multer.File[];
    if (!files) {
      res.status(400).send("No files uploaded.");
      return;
    }
    for (const file of files) {
      const decompressedData = await decompressData(file.buffer);
      await saveDataToFile(decompressedData, file.originalname);
    }
    res.locals.filenames = files.map((file) => file.originalname);
    next();
  });
}

export async function uploadMultipleFilesWithMetadataMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.array("files")(req, res, async (err) => {
    if (err) {
      res.status(400).send(err.message);
      return;
    }
    const files = req.files as Express.Multer.File[];
    if (!files) {
      res.status(400).send("No files uploaded.");
      return;
    }
    const filenames = [];
    const metadata: any[] = [];
    for (const file of files) {
      const decompressedData = await decompressData(file.buffer);
      const fileMetadata = JSON.parse(decompressedData.toString());
      await saveDataToFile(file.buffer, file.originalname);
      filenames.push(file.originalname);
      metadata.push(fileMetadata);
    }
    // use map to get the key(filenames) -> metadata
    res.locals.metadata = filenames.map((filename, index) => ({
      filename,
      metadata: metadata[index],
    }));
    console.log(res.locals.metadata);
    next();
  });
}