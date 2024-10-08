import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListCheck } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form ";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChapterForm from "./_components/chapter-form";
import { Banner } from "@/components/banner";
import Action from "./_components/action";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include:{
      chapters:{
       orderBy:{
        position:"asc"
       }
      },
      attachments:{
        orderBy:{
          createdAt:"desc"
        }
      }
    }
  });

  const cateogories = await db.cateogory.findMany({
    orderBy:{
        name:"asc"
    }
  })

 

  if (!course) redirect("/");
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.cateogoryId,
    course.chapters.some((chapter)=>chapter.isPublished)
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
    {
      !course.isPublished && (
        <Banner
         label="This course is unpublished.It will not visible to the students."
        />
      )
    }
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">
            complete all fields {completionText}
          </span>
        </div>

        <Action 
          disabled={!isComplete}
          courseId = {params.courseId}
          isPublished={course.isPublished}
        />

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customise your course</h2>
          </div>
          <TitleForm initialData={course} />
          <DescriptionForm initialData={course} />
          <ImageForm initialData={course} />
          <CategoryForm 
           initialData={course}
           options={cateogories.map((cateogory)=>({label:cateogory.name,value:cateogory.id}))}
          />
        </div>
        <div className="space-y-6">
           <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListCheck}/>
              <h2 className="text-xl">
                Course chapters
              </h2>
            </div>
            <div>
              <ChapterForm initialData={course}/>
            </div>
           </div>

           <div>
           <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleDollarSign}/>
            <h2 className="text-xl">Sell your course</h2>
           </div>
           <PriceForm
          initialData={course}
          />

           </div>

           <div>
           <div className="flex items-center gap-x-2">
            <IconBadge icon={File}/>
            <h2 className="text-xl">Resources & Attachments</h2>
           </div>
           <AttachmentForm
              initialData={course} 
             />
           </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseIdPage;
