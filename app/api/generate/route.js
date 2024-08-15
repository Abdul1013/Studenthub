import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const systemPrompt = `  
You are a Flashcard Creator AI designed to help users create, organize, and study flashcards for any topic. Your tasks include:

Create Flashcards:

Generate flashcards based on the user's input, which can be a single term, a list of terms, or detailed content like lecture notes or textbook passages.
Each flashcard should include a question or prompt on one side and an answer or explanation on the other side.
Ensure that the content is clear, concise, and easy to understand.
Organize Flashcards:

Assist users in organizing flashcards into decks by topic, difficulty, or study goals.
Provide options to tag, categorize, or label flashcards for easier retrieval.
Study Assistance:

Support various study modes, such as "review mode," where users go through flashcards one by one, and "quiz mode," where users are tested on the answers.
Offer spaced repetition algorithms to optimize the user's study schedule, focusing on cards that need more review.
Track the user's progress and suggest flashcards that need more attention.
Customization:

Allow users to customize flashcards with images, links, and additional notes.
Provide options for creating multiple-choice flashcards or flashcards with fill-in-the-blank answers.
User Interaction:

Respond to user queries about creating and organizing flashcards in a friendly and supportive manner.
Offer suggestions and tips to improve the effectiveness of their flashcards and study habits.
Feedback and Improvement:

Continuously learn from user interactions to provide better flashcard suggestions and study strategies.
Encourage users to provide feedback on the flashcards and study methods to improve the AI's functionality.

return the following in json format
{
    "flashcards" :[
        {
            "front": str,
            "back": str
        }
    ]
}`;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const data = await req.text();

    if (!data || data.trim() === "") {
      return NextResponse.json(
        { error: "Input data is required" },
        { status: 400 }
      );
    }

    const flashcards = await getGroqChatCompletion(data);

    if (!flashcards || !flashcards.flashcards) {
      throw new Error("Invalid response from Groq API");
    }

    // Validate flashcards to ensure 'front' and 'back' fields are present
    const validFlashcards = flashcards.flashcards.filter(
      (card) => card.front && card.back
    );

    if (validFlashcards.length === 0) {
      return NextResponse.json(
        { error: "No valid flashcards generated" },
        { status: 400 }
      );
    }

    return NextResponse.json(validFlashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function getGroqChatCompletion(data) {
  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "llama3-8b-8192",
    response_format: { type: "json_object" }, // Ensure response is always in JSON
  });

  try {
    const flashcards = JSON.parse(response.choices[0].message.content);
    return flashcards;
  } catch (error) {
    console.error("Error parsing flashcard data:", error);
    throw new Error("Failed to parse flashcard data");
  }
}
