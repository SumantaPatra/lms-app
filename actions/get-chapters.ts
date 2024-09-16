import { db } from "@/lib/db";

interface getChapterProps{
    userId:string,
    courseId:string,
    chapterId:string
}

export const getChapters = async({
    userId,
    courseId,
    chapterId
}:getChapterProps)=>{
   
    try {
        const purchase = await db.purchase.findUnique({
            where:{
                userId_courseId:{
                    userId,
                    courseId
                }
            }
        });
        const course = await db.course.findUnique({
            where:{
                isPublished:true,
                id:courseId
            },
            select:{
                price:true
            }
        });
        const chapter = await db.chapter.findUnique({
            where:{
                id:chapterId,
                isPublished:true
            }
        });
        if(!course || !chapter) throw new Error("Chapter or course not found")
    } catch (error) {
        console.log("[GET_chapter]",error);
        return {
            chapter:null,
            course:null,
            muxData:null,
            attachments:[],
            nextChapter:null,
            userProgress:null,
            purchase:null
        }
    }
}