import path from "path";
import { extractText } from "../../extractor/extract-text";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils";

export default async function multipleTextMiddleware(req: Request, res: Response, next: NextFunction) {
    const projectId = req.headers.projectid as string ?? req.headers.projectId as string ?? req.headers.Projectid as string;

    const filenames = res.locals.filenames;
    console.log(`Generating data for files: ${filenames.join(", ")}`);
    const filepaths = filenames.map((filename: string) => path.resolve(`./src/uploads/${filename}`));
    const texts = await Promise.all(filepaths.map(async (filepath: string) => {
        const ext = path.extname(filepath);
        return await extractText(filepath, ext);
    }));
    res.locals.texts = texts;
    next();

    try {
        await Promise.all(filenames.map(async (filename: string, index: number) => {
            await prisma.document.create({
                data: {
                    content: texts[index],
                    filepath: filename,
                    name: filename.split('/').pop() as string ?? "dadfadfad",
                    projectId,
                }
            });
        }));

    } catch (error) {
        console.log("Error creating document: ", error);
    }
}