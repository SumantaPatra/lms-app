import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ChapterIdPage = async({params}:{
    params:{courseId:string,chapterId:string}
}) => {
    const {userId} = auth();
    if(!userId) redirect("/")
    return ( 
        <div>Chapter</div>
     );
}
 
export default ChapterIdPage;