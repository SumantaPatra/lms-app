import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/teacher";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const {title} = await req.json();

    if (!userId || !isAdmin(userId)) return new NextResponse("Unauthorises", { status: 401 });

   

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);

    // if(!userId) NextResponse.
  } catch (error) {
    console.log("[Courses]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
