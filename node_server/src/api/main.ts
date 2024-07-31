import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import extractor from "../extractor";
import { extractDataFromDocument } from "../prompt/extract";
import { uploadFileMiddleware, uploadMultipleFilesMiddleware } from "./uploads/upload";
import cors from "cors";
import textMiddleware from "./single/generate";
import multipleTextMiddleware from "./multiple/generate";
import { convertJsonToTypeOf } from "../prompt/type.construct";
import userRouter from "./db.routes/account";
import documentRouter from "./db.routes/document";
import projectRouter from "./db.routes/project";
import { authenticate, prisma } from "./utils";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import ruleRouter from "./db.routes/rules";

dotenv.config();


const app: Express = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With, userId, projectId, rule",
}));

app.use(cookieParser())
app.use(bodyParser.json({
}));

app.get("/", async (req: Request, res: Response) => {

    const filepath = './src/sample_files/invoice.jpg';

    const text = await extractor.getImageText({ filepath });
    const extractedJSON = await extractDataFromDocument(text);

    res.status(200).json(convertJsonToTypeOf(JSON.parse(extractedJSON)));
});

app.use("/user", userRouter);
app.use("/document", authenticate, documentRouter);
app.use("/project", authenticate, projectRouter);
app.use("/rule", ruleRouter)

app.post("/upload_file", authenticate, uploadFileMiddleware, textMiddleware, async (req: Request, res: Response) => {
    console.log("File uploading...");

    const projectId = req.headers.projectid as string ?? req.headers.projectId as string;
    const outputSchema = req.headers.rule as string ?? req.headers.Rule as string;
    const text = res.locals.text;

    const extractedJSON = await extractDataFromDocument(text, outputSchema);

    res.status(200).json(JSON.parse(extractedJSON));

    try {
        await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                tables: extractedJSON
            }
        });
    } catch (error) {
        console.log("Error updating project: ", error);
    }
});

app.post("/upload_files", authenticate, uploadMultipleFilesMiddleware, multipleTextMiddleware, async (req: Request, res: Response) => {
    console.log("Files uploading...");
    const texts = res.locals.texts;

    const projectId = req.headers.projectid as string ?? req.headers.projectId as string ?? req.headers.Projectid as string;
    const outputSchema = req.headers.rule as string ?? req.headers.Rule as string;

    console.log("Texts extracted from files: ", texts);

    const extractedJSONs = await Promise.all(texts.map(async (text: string) => {
        return await extractDataFromDocument(text, outputSchema);
    }));
    console.log("Extracted JSONs: ", extractedJSONs.map((json: string) => JSON.parse(json)));
    


    try {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        let tables;
        let updatedTables = [];
        // Check if project?.tables is not undefined and not an empty string
        if (project?.tables && project.tables.trim() !== "") {
            try {
                tables = JSON.parse(project.tables);
            } catch (error) {
                console.error("Error parsing JSON from project.tables: ", error);
                // Handle malformed JSON, e.g., initialize tables to an empty array or object
                tables = []; // or {} depending on your expected structure
            }
        } else {
            // Initialize tables to an empty array or object if project?.tables is undefined or empty
            tables = []; // or {} depending on your expected structure
        }

        const newTables = extractedJSONs.map((json: string) => JSON.parse(json));

        if (typeof tables === "object" && !Array.isArray(tables)) {
            updatedTables = [tables, ...newTables]; // Add new tables to existing tables to form a new array
            await prisma.project.update({
                where: {
                    id: projectId,
                },
                data: {
                    tables: JSON.stringify(updatedTables)
                }
            });
        } else if (Array.isArray(tables)) {
            updatedTables = [...tables, ...newTables]; // Add new tables to existing tables to form a new array
            await prisma.project.update({
                where: {
                    id: projectId,
                },
                data: {
                    tables: JSON.stringify(updatedTables)
                }
            });
        } else {
            updatedTables = newTables;
            await prisma.project.update({
                where: {
                    id: projectId,
                },
                data: {
                    tables: JSON.stringify(newTables)
                }
            });
        }

        res.status(200).json(updatedTables);
    } catch (error) {
        console.log("Error updating project: ", error);
    }
});

export default app;