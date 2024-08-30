"use client";
import { BarChart, Compass, Layout, List } from "lucide-react";
import SideBarItem from "./sidebar-item";
import { usePathname } from "next/navigation";
const guestRoutes = [
    {
        label:"Dashboard",
        icon: Layout,
        href:"/"
    },
    {
        label:"Browse",
        icon: Compass,
        href:"/search"
    }
]
const teacherRoutes = [
  {
    label:"Courses",
    icon: List,
    href:"/teacher/courses"
},
{
    label:"Analytics",
    icon: BarChart,
    href:"/teacher/analytics"
}
]

const SideBarRoutes = () => {
  const pathName = usePathname();
  const isTeacherPage = pathName?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes
    return ( 
        <div className="flex flex-col">
          {
            routes.map((route)=>(
                <SideBarItem key={route.href} label={route.label} href={route.href} icon={route.icon} />
            ))
          }
        </div>
     );
}
 
export default SideBarRoutes;