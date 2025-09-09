import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../../../config/OpenAiModel";
import { db } from "../../../../config/db";
import { SessionChartTable } from "../../../../config/schema";
import { eq } from "drizzle-orm";
const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just had a voice-based medical consultation. Based on the conversation, generate a detailed summary report with the following fields:

1. sessionId: a unique session identifier  
2. agent: the medical specialist name (e.g., "General Physician AI")  
3. user: name of the patient or "Anonymous" if not provided  
4. timestamp: current date and time in ISO format  
5. chiefComplaint: one-sentence summary of the main health concern  
6. summary: 2–3 sentence summary of the conversation, symptoms, and context  
7. symptoms: list of symptoms mentioned by the user  
8. duration: how long the user has experienced the symptoms  
9. severity: mild, moderate, or severe  
10. medicationsMentioned: list of any medicines mentioned  
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:

{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}

Only include valid fields. Respond with nothing else. Depends on AI agent info and Conversation between agent and user.`;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, sessionDetail, messages } = await req.json();

    const userInput = `AI Doctor agent Info: ${JSON.stringify(
      sessionDetail
    )}\nConversations: ${JSON.stringify(messages)}`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-05-20",
      messages: [
        {
          role: "system",
          content: REPORT_GEN_PROMPT,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    const rawContent = completion?.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    const cleanJSON = rawContent
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "");

    const parsed = JSON.parse(cleanJSON);
    const result=await db.update(SessionChartTable).set({
        report:parsed,
        conversation:messages
    }).where(eq(SessionChartTable.sessionId,sessionId))
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
