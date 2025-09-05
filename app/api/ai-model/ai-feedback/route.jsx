import { NextResponse } from "next/server";
import OpenAI from "openai";
import { FEEDBACK_PROMPT } from "@/public/services/Constants";

const openai = new OpenAI({
  apiKey:"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",
});

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ✅ use valid OpenAI free/cheap model
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error(error);
    if (error.code === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a few seconds." },
        { status: 429 }
      );
    } else {
      return NextResponse.json(
        { error: "An error occurred while generating the response." },
        { status: 500 }
      );
    }
  }
}
