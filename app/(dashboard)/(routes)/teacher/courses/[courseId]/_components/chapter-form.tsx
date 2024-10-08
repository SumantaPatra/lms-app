"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import ChapterList from "./chapter-list";

interface ChapterFormProps {
  initialData: Course & {chapters:Chapter[]}
}
const formSchema = z.object({
  title: z.string().min(1),
});

const ChapterForm = ({ initialData }: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating,setIsUpdating] = useState(false);
  const toggleCreating = () => setIsCreating((currState) => !currState);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${initialData?.id}/chapters`, values);
      toast.success("Chapter created");
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const onReorder = async(updateData:{id:string,position:number}[])=>{
    try {
        setIsUpdating(true);
        await axios.put(`/api/courses/${initialData.id}/chapters/reorder`,{
            list:updateData
        })
        toast.success("chapter reordered");
        router.refresh()
    } catch (error) {
        toast.error("Something went wrong")
    }finally{
        setIsUpdating(false)
    }

  }
  const onEdit = (id:string) =>{
    router.push(`/teacher/courses/${initialData.id}/chapters/${id}`)
  }
  return (
    <div className="mt-6 border bg-state-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Introduction to the course' "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
               Create
            </Button>
          </form>
        </Form>
      )}
      {
        !isCreating &&(
            <div className={cn(
            "text-sm mt-2",
             initialData.chapters.length && "text-slate-500 italic"
            )}>
                {!initialData.chapters.length && "No chapters"}
                <ChapterList 
                 onEdit={onEdit}
                 onReorder={onReorder}
                 items = {initialData.chapters || []}
                />
            </div>
        )
      }
      {
        !isCreating &&(
            <p className="text-xs text-muted-foreground mt-4">
                Drag and drop to reorder the chapters
            </p>
        )
      }
    </div>
  );
};

export default ChapterForm;
