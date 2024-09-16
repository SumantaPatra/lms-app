"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MuxPlayer from '@mux/mux-player-react'
import { Button } from "@/components/ui/button";
import {Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

interface ChapterVideoFormProps {
  initialData: Chapter & {muxData?:MuxData | null};
  courseId:string;
  chapterId:string
}
const formSchema = z.object({
   videoUrl: z.string().min(1)
});

const ChapterVideoForm= ({ initialData,courseId,chapterId }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((currState) => !currState);
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="mt-6 border bg-state-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}{" "}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
             playbackId={initialData?.muxData?.playbackId || ""}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {
        initialData.videoUrl && !isEditing && (
            <div className="text-xs text-muted-foreground mt-2">
                Videos can take a few minutes to process.refresh the page if
                videos doesnot appear.
            </div>
        )
      }
    </div>
  );
};

export default ChapterVideoForm;
