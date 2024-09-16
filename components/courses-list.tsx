import { Cateogory,Course } from "@prisma/client";
import CourseCard from "./course-card";

type CourseWithProgressWithCategory = Course & {
    cateogory: Cateogory | null;
    chapters:{id:string}[];
    progress:number|null;
}

interface CourseListProps{
    items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({items}:CourseListProps)=>{
    return (
        <div>
            <div className="grid md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {
                    items.map((item)=>(
                        <CourseCard
                         key={item.id}
                         id={item.id}
                         title={item.title}
                         imageUrl={item.imageUrl!}
                         chaptersLength = {item.chapters.length}
                         price = {item.price!}
                         progress={item.progress}
                         category = {item.cateogory?.name!}
                        />
                    ))
                }
            </div>
            {
                items.length === 0 && (
                    <div className="text-sm text-muted-foreground mt-10 text-center">
                        No courses found
                    </div>
                )
            }

        </div>
    )
}