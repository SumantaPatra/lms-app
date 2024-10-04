"use client"
import {Button}  from "@/components/ui/button"
import {formatPrice} from "@/lib/format"


interface EnrollBtnProps {
   price:number,
   courseId:string
}
const CourseEnrollButton = ({
    price,
    courseId
}:EnrollBtnProps) => {
    return (
     <Button
     size="sm"
     className="w-full md:w-auto "
     >
        Enroll for {formatPrice(price)}
     </Button>
    );
}
 
export default CourseEnrollButton;