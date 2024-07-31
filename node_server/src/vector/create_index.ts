import { pc } from "./pinecone";

export async function createPineconeIndex(indexName: string, dimension: number = 768) {
    try {
        // Check if the index already exists
        const existingIndexes = await pc.listIndexes();

        if (!Object.keys(existingIndexes).includes(indexName)) {
            // Create a new index
            await pc.createIndex({
                name: indexName,
                dimension: dimension,
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-east-1'
                    }
                }
            });
            console.log(`Index "${indexName}" created successfully.`);
        } else {
            console.log(`Index "${indexName}" already exists.`);
        }
    } catch (error) {
        console.error('Error creating Pinecone index:', error);
    }
}