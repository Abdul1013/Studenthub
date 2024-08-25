import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// Ensure fetch is imported for environments that do not have it
import fetch from "node-fetch";
global.fetch = fetch; // This line ensures fetch is available globally

const systemPrompt = `
You are a Rate My Professor agent to help students find classes by answering their questions.
For every user question, return the top 3 professors that match the query.
Use their details to help answer the question if needed.
`;

export async function POST(req) {
  try {
    const data = await req.json();

    // Initializing API clients
    const pinecone = new Pinecone();
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT, // Ensure this is set in your environment variables
    });

    const index = pinecone.Index("rag");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment variables
    });

    const text = data[data.length - 1].content;

    // Fetch the embedding from OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Query Pinecone
    const results = await index.query({
      topK: 3,
      includeMetadata: true,
      vector: embedding,
      namespace: "ns1",
    });

    let resultString = "Returned Results:\n";
    results.matches.forEach((match) => {
      resultString += `
      Professor: ${match.id}
      Review: ${match.metadata.review}
      Subject: ${match.metadata.subject}
      Stars: ${match.metadata.stars}
      \n`;
    });

    const lastMessageContent =
      data[data.length - 1].content + "\n" + resultString;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...lastDataWithoutLastMessage,
        { role: "user", content: lastMessageContent },
      ],
      model: "gpt-3.5-turbo",
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    let errorMessage = "An error occurred. Please try again later.";

    // Handle specific error types
    if (error.response) {
      if (error.response.status === 429) {
        errorMessage = "Quota exceeded: You have reached your usage limits.";
      } else if (error.response.status === 403) {
        errorMessage =
          "Access denied: Please check your API key and permissions.";
      }
    } else if (error.message.includes("Pinecone")) {
      errorMessage = "Pinecone error: " + error.message;
    } else if (error.message.includes("OpenAI")) {
      errorMessage = "OpenAI error: " + error.message;
    }

    // Log the error for debugging purposes
    console.error("Error:", error);

    // Return the error message as a plain text response
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
