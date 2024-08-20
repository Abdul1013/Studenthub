import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { Stream } from "@mui/icons-material";

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`;

export async function POST(req) {
  const data = await req.json();

  //innitializing API's
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index("rag").namespace("ns1");
  const openai = new OpenAI();

  //procccesiing user query
  const text = data[data.length - 1].content;
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  // querying pinecone
  const results = await index.query({
    topK: 5,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });

  // format result
  let resultString = "";
  results.matches.forEach((match) => {
    resultString += `
  Returned Results:
  Professor: ${match.id}
  Review: ${match.metadata.stars}
  Subject: ${match.metadata.subject}
  Stars: ${match.metadata.stars}
  \n\n`;
  });

  //combining user responese with pinceone result
  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

  //chat completion request
  const completion = await openai.chat.comletions.create({
    messages : [
        {role: 'system', content: systemPrompt},
        ...lastDataWithoutLastMessage,
        {role: 'user', content: lastMessageContent},
    ],
    model : 'gpt-3.5-turbo',
    Stream: true,
  })

  const Stream = new ReadableStream({
    async start (controller) {
        const enconder = new TextEncoder()
        try {
            for await (const chunk of completion) {
                const content = chunk.choice[0]?.delta?.content
                if(content){
                    
                }
            }
        }
        
    }
  })
}
