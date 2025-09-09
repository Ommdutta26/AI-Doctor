import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../config/db";
import { SessionChartTable, usersTable } from "../../../../config/schema";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = uuidv4();
    const email = user.primaryEmailAddress.emailAddress;
    const name = user.fullName || "Unknown";

    // Ensure user exists in usersTable
    await db.insert(usersTable).values({
      email,
      name,
      credits: 0,
    }).onConflictDoNothing(); // skip insert if email already exists

    // Insert session
    const result = await db.insert(SessionChartTable).values({
      sessionId,
      createdBy: email,
      notes,
      selectedDoctor,
      createdOn: new Date().toISOString(),
    }).returning();

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
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let result;
    const email = user.primaryEmailAddress.emailAddress;

    if (sessionId === "all") {
      result = await db
        .select()
        .from(SessionChartTable)
        .where(eq(SessionChartTable.createdBy, email))
        .orderBy(desc(SessionChartTable.id));
    } else if (sessionId) {
      result = await db
        .select()
        .from(SessionChartTable)
        .where(eq(SessionChartTable.sessionId, sessionId));
    } else {
      result = [];
    }

    // Sanitize for JSON
    const sanitized = result.map((row: any) => ({
      ...row,
      createdOn: row.createdOn?.toString(),
      id: typeof row.id === "bigint" ? Number(row.id) : row.id,
    }));

    return NextResponse.json(sanitized);
  } catch (error: any) {
    console.error("GET /api/session-chat error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

