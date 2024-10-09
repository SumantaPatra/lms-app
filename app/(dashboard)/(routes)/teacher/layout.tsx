import { isAdmin } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const TeacherLayout = ({children}:{
    children:React.ReactNode
})=>{
  const {userId} = auth();

  if(!userId) return redirect("/");

  if(!isAdmin(userId)) return redirect("/");

  return <>{children}</>

    
}

export default TeacherLayout;