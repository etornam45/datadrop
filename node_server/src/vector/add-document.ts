
import { embedText } from "../embed/embedding";
import { pc } from "./pinecone";

export async function addDocumentToPinecone(document: { id: string; text: string, filename: string }, indexName: string, namespace: string) {
    const index = pc.index(indexName);

    // Generate embedding for the document
    const embedding = await embedText(document.text);

    // Upsert the document into Pinecone
    await index.namespace(namespace).upsert([{
        id: document.id,
        values: embedding,
        metadata: { text: document.text, filename: document.filename }
    }]);

    console.log(`Document ${document.id} added to Pinecone.`);
}

export async function addMultipleDocuments(documents: { id: string; text: string, filename: string }[], indexName: string, namespace: string) {
    for (const doc of documents) {
        await addDocumentToPinecone(doc, indexName, namespace);
    }
    console.log(`${documents.length} documents added to Pinecone.`);
}