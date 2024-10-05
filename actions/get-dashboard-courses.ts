import { db } from "@/lib/db";
import { Cateogory, Chapter, Course } from "@prisma/client"
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    cateogory:Cateogory;
    chapters:Chapter[];
    progress:number | null;
}

type DashboardCourses = {
    completedCourses:CourseWithProgressWithCategory[];
    courseInProgress:CourseWithProgressWithCategory[];

}

export const getDashboardCourses = async(userId:string):Promise<DashboardCourses>=>{
  try {
   
    const purchasedCourse = await db.purchase.findMany({
        where:{
            userId:userId
        },
        select:{
            course:{
                include:{
                    cateogory: true,
                    chapters:{
                        where:{
                            isPublished:true
                        }
                    }
                }
            }
        }
    })

    const courses = purchasedCourse.map((purchase)=>purchase.course) as CourseWithProgressWithCategory[]

    for(let course of courses){
        const progress = await getProgress(userId,course.id);
        course["progress"] = progress;
    }
    
    const completedCourses = courses.filter((course)=>course.progress === 100);
    const courseInProgress = courses.filter((course)=> (course.progress??0) < 100);

    return {
        completedCourses,
        courseInProgress
    }

    
  } catch (error) {
    console.log("GET_DASHBOARD_COURSES",error);
    return {
        completedCourses:[],
        courseInProgress:[]
    }
  }
}