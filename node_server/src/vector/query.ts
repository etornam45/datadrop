import { pc } from "./pinecone";

export async function queryPinecone(embedding: number[], topK: number = 2, indexName: string, namespace: string) {
    const index = pc.index(indexName);
    const queryResponse = await index.namespace(namespace).query({
        vector: embedding,
        topK: topK,
        includeMetadata: true,
    });
    return queryResponse.matches;
}

export async function getDocumentById(id: string, indexName: string, namespace: string, topK: number = 1) :Promise<string | null | any> {
    const index = pc.index(indexName);
    const queryResponse = await index.namespace(namespace).query({
        id: id,
        topK,
        includeMetadata: true,
    });
    return queryResponse.matches;
}