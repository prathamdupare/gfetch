import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();
    console.log("THE data given to gpt is ", body);

    const prompt = `
I want to classify the data into the following categories:
- Important
- Promotions 
- Social
- Marketing 
- Spam
- General

Please classify the data based on snippets for each object and add value to key "classification" with the appropriate classification for each object. Return the updated array.

The data is: ${JSON.stringify(body)}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });
    console.log(completion.choices[0].message.content);

    return NextResponse.json(
      { output: completion.choices[0].message.content },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "GPT failed to generate the data" },
      { status: 200 },
    );
  }
}
