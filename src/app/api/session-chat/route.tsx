import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../config/db";
import { SessionChartTable,usersTable } from "../../../../config/schema";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from 'drizzle-orm' 
export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const sessionId = uuidv4();
    const email = user.primaryEmailAddress?.emailAddress || "";
    const name = user.fullName || "Unknown";
    if(sessionId=='all'){

    }else{
      
    }
    await db.insert(usersTable).values({
    email,
    name,
    credits: 0,
    }).onConflictDoNothing(); // skip insert if email already exists


    const result = await db.insert(SessionChartTable).values({
      sessionId: sessionId,
      createdBy: user.primaryEmailAddress?.emailAddress,
      notes: notes,
      selectedDoctor: selectedDoctor,
      createdOn: new Date().toISOString(),
      // @ts-ignore if needed
    }).returning({ SessionChartTable });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("POST /api/session-chat error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  let result;
  if (sessionId === "all") {
    result = await db
      .select()
      .from(SessionChartTable)
      .where(eq(SessionChartTable.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(SessionChartTable.id));
  } else {
    result = await db
      .select()
      .from(SessionChartTable)
      .where(eq(SessionChartTable.sessionId, sessionId));
  }

  // 🔁 Convert all values to JSON-safe formats (e.g., Date -> string, BigInt -> string/number)
  const sanitized = result.map((row: any) => ({
    ...row,
    createdOn: row.createdOn?.toString(), // assuming this might be a Date object
    // convert BigInt if any field uses it
    id: typeof row.id === 'bigint' ? Number(row.id) : row.id,
  }));

  return NextResponse.json(sanitized); // or send full array if needed
}
