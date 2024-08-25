import { Pinecone} from "@pinecone-database/pinecone";
import OpenAI from "openai";
import fetch from "node-fetch";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables from .env file
config();

// Ensure fetch is available globally (for environments that don't have fetch)
global.fetch = fetch;

// Initialize Pinecone client
const pinecone = new Pinecone();

async function initializePinecone() {
  try {
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      // environment: process.env.PINECONE_ENVIRONMENT,
    });
    console.log("Pinecone initialized successfully");
  } catch (error) {
    console.error("Error initializing Pinecone:", error);
  }
}

// Create a Pinecone index
async function createIndex() {
  try {
    await pinecone.createIndex({
      name: "rag",
      dimension: 1536,
      metric: "cosine",
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    console.log("Index created successfully");
  } catch (error) {
    console.error("Error creating index:", error);
  }
}

// Process review data and insert into Pinecone
async function processAndInsertData() {
  try {
    // Load review data
    const dataPath = path.join(__dirname, "reviews.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    const processedData = [];
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Create embeddings for each review
    for (const review of data.reviews) {
      const response = await client.embeddings.create({
        input: review.review,
        model: "text-embedding-ada-002", // Use an appropriate OpenAI embedding model
      });
      const embedding = response.data[0].embedding;
      processedData.push({
        id: review.professor,
        values: embedding,
        metadata: {
          review: review.review,
          subject: review.subject,
          stars: review.stars,
        },
      });
    }

    // Insert the embeddings into the Pinecone index
    const index = pinecone.Index("rag");
    const upsertResponse = await index.upsert({
      vectors: processedData,
      namespace: "ns1",
    });
    console.log(`Upserted count: ${upsertResponse.upsertedCount}`);

    // Print index statistics
    const indexStats = await index.describeIndexStats();
    console.log("Index statistics:", indexStats);
  } catch (error) {
    console.error("Error processing and inserting data:", error);
  }
}

(async () => {
  await initializePinecone();
  await createIndex();
  await processAndInsertData();
})();
