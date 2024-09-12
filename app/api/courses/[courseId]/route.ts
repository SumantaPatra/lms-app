import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("UnAuthorized", { status: 401 });
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include:{
        chapters:{
          include:{
            muxData:true
          }
        }
      }
    });
    
    if(!course) return new NextResponse("Not found error",{status:404})

      console.log("chapyter",course.chapters);
      

    for(const chapter of course.chapters){
      if(chapter.muxData?.assetId){
        await video.assets.delete(chapter.muxData.assetId)
      }

    }

    const deletedCourse = await db.course.delete({
      where:{
        id:params.courseId
      }
    })

    return NextResponse.json(deletedCourse)


  } catch (error) {
    console.log("[Course id delete]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("[courseId]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
