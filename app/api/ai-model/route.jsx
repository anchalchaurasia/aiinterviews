import { QUESTIONS_PROMPT } from "@/public/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { jobPosition, jobDescription, duration, type } = await req.json();

  const FINAL_PROMPT = QUESTIONS_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescriptio}}', jobDescription)
    .replace('{{duration}}', duration)
    .replace('{{type}}', type);

  console.log(FINAL_PROMPT);

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: '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',
  });

  // Delay the request by 15 seconds (throttle)
  await new Promise((resolve) => setTimeout(resolve, 15000));

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        { role: "user", content: FINAL_PROMPT }
      ],
    });

    console.log(completion.choices[0].message);
    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error(error);
    if (error.code === 429) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again in a few seconds." }, { status: 429 });
    } else {
      return NextResponse.json({ error: "An error occurred while generating the response." }, { status: 500 });
    }
  }
}
