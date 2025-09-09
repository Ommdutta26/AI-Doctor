import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../../../config/OpenAiModel";
import { AIDoctorAgents } from "../../../../shared/list";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const notes = body?.notes;

    if (!notes) {
      console.error("No notes provided");
      return NextResponse.json({ error: "Missing notes" }, { status: 400 });
    }

    console.log("✅ Notes received:", notes);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant. Based on the user's symptoms, suggest a list of 2 to 3 suitable doctors from the array below. Return ONLY a valid JSON array of doctor objects, and nothing else — no greetings, no explanations.

          Doctor list:
          ${JSON.stringify(AIDoctorAgents)}
          `
                  },
                  {
                    role: "user",
                    content: `User Notes/Symptoms: ${notes}`
                  }
                ],
              });

    const rawContent = completion?.choices?.[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }
    const cleanJSON = rawContent.trim().replace(/^```json/, "").replace(/```$/, "");
    const parsed = JSON.parse(cleanJSON);
    console.log("✅ Suggested Doctors:", parsed);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("🔥 API ERROR:", error?.response?.data || error?.message || error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
