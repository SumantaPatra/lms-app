import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps{
    value:number,
    variant?:"default" | "success",
    size?:"default" | "sm"
}
const colorVariant={
    default:"text-sky-700",
    success:"text-emerald-700"
}
const sizeVariant={
    default:"text-sm",
    sm:"text-xs"
}

const CourseProgress = ({
    value,
    variant,
    size
}:CourseProgressProps) => {
    
    return ( 
        <div>
          <Progress 
           className="h-2"
           value={value}
           variant={variant}
          />
          <p className={cn(
            "font-medium mt-2 text-sky-700",
            colorVariant[variant || "default"],
            sizeVariant[size || "default"]
          )}>{Math.round(value)}% Complete</p>
        </div>
     );
}
 
export default CourseProgress;