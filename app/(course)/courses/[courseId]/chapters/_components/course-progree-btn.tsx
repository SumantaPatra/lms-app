"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios"
import { useConfettiStore } from "@/app/hooks/use-confetti-store";
import { CheckCircle, XCircle } from "lucide-react";;



interface CourseProgressBtnProps{
    chapterId:string,
    courseId:string,
    nextChapterId?:string,
    isComplete?:boolean
}

const CourseProgressButton = ({
    chapterId,
    courseId,
    nextChapterId,
    isComplete
}:CourseProgressBtnProps) => {
    const Icon = isComplete ? XCircle : CheckCircle;
    const router = useRouter();
    const confetti = useConfettiStore();
    const[isLoading,setIsLoading] = useState(false);

    const onClick = async()=>{
    try {
        setIsLoading(true);
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
            isComplete:!isComplete
        });

        if(!isComplete && !nextChapterId){
            confetti.onOpen();
        }
        if(!isComplete && nextChapterId){
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
        toast.success("progress updated");
        router.refresh()
        
    } catch (error) {
        toast.error("Something went wrong")
    }finally{
        setIsLoading(false)
    }
    }

    return (
        <Button 
         onClick={onClick}
         type="button"
         variant={isComplete ? "outline" : 'success'}
         className="w-full md:w-auto"
         disabled={isLoading}
        >
            {isComplete ? "Not completed":"Mark as completed"}
            <Icon 
             className="h-4 w-4 ml-2"
            />
        </Button>
    );
}
 
export default CourseProgressButton;