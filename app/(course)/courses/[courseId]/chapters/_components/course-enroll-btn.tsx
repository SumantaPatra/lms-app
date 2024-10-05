"use client"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
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
    const [isLoading,setIsLoading] = useState(false);
    const onClick = async()=>{
        try {
            setIsLoading(true);
            const response = await axios.post(`/api/courses/${courseId}/checkout`)
            window.location.assign(response.data.url)
            
        } catch (error) {
            toast("Something went wrong")
        }finally{
            setIsLoading(false);
        }
    }
    return (
     <Button
     size="sm"
     onClick={onClick}
     disabled={isLoading}
     className="w-full md:w-auto "
     >
        Enroll for {formatPrice(price)}
     </Button>
    );
}
 
export default CourseEnrollButton;