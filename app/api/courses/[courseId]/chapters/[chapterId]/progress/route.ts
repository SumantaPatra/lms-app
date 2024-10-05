import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PUT(
    req:Request,
    {params}:{params:{courseId:string,chapterId:string}}
){
    
    try {
        const {userId} = auth();
        const {isComplete} =  await req.json();

        if(!userId) return new NextResponse("Unauthorized",{status:401});

        const userProgress = await db.userProgress.upsert({
            where:{
                userId_chapterId:{
                    userId:userId,
                    chapterId:params.chapterId
                }
            },
            update:{
                isCompleted:isComplete
            },
            create:{
                userId,
                chapterId:params.chapterId,
                isCompleted:isComplete
            }
        })

        return NextResponse.json(userProgress)
        
    } catch (error) {
        console.log("[chapterId progress error]",error)
        return new NextResponse("Internal server error",{
            status:500
        })
    }
}