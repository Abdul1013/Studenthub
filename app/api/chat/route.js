import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
You are a Rate My Professor agent to help students find classes by answering their questions.
For every user question, return the top 3 professors that match the query.
Use their details to help answer the question if needed.
`;

export async function POST(req) {
  try {
    const data = await req.json();

    // Initializing API clients
    const pc = new Pinecone();
    await pc.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: "us-east1-gcp", // Adjust according to your environment
    });
    const index = pc.Index("rag");
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    const text = data[data.length - 1].content;
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    const results = await index.query({
      topK: 3,
      includeMetadata: true,
      vector: embedding.data[0].embedding,
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

    // Return the error message as a plain text response
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
