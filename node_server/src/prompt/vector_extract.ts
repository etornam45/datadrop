import { getDocumentById } from "../vector/query";
import { extractDataFromDocument } from "./extract";

export async function extractDataById(id: string, indexName: string, namespace: string = ""): Promise<string> {
    const document = await getDocumentById(id, indexName, namespace, 1);
    if (!document) {
        throw new Error(`Document with ID ${id} not found in namespace: ${namespace || "default"}.`);
    }
    return extractDataFromDocument(document);
}