import { NextFunction, Request, Response } from "express";
import path from "path";
import { extractText } from "../../extractor/extract-text";
import { prisma } from "../utils";
import { addDocumentToPinecone } from "../../vector/add-document";
import { randomUUID } from "crypto";

export default async function textMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const projectId = req.headers.projectId as string ?? req.headers.projectid as string;
  const userId = req.headers.JWTuserId as string;

  const filename = res.locals.filename;
  console.log(`Generating data for file: ${filename}`);

  const filepath = path.resolve(`./src/uploads/${filename}`);
  const ext = path.extname(filepath);

  const text = await extractText(filepath, ext);

  res.locals.text = text;
  next();

  try {
    const document = await prisma.document.create({
      data: {
        content: text,
        filepath: filename,
        name: filename.split("/").pop(),
        projectId,
      },
    });

    await addDocumentToPinecone(
      {
        filename,
        id: document.id,
        text,
      },
      userId,
      projectId,
    );
  } catch (error) {
    console.log("Error creating document: ", error);
  }
}