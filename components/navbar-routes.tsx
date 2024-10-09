"use client"
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isAdmin } from "@/lib/teacher";

const  NavbarRoutes = () => {
    const pathName = usePathname();
    const {userId} = useAuth()
    const isTeacherPage = pathName.startsWith('/teacher');
    const isPlayerPage = pathName.includes("/courses");
    const isSearchPage = pathName === "/search";
    return ( 
        <>
        {
            isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput/>
                </div>
            )
        }
        <div className="flex gap-x-2 ml-auto">
            {
                (isPlayerPage || isTeacherPage) ? (
                    <Link href="/">
                    <Button size="sm" variant="ghost">
                        <LogOut className="h-4 w-4 mr-2"/>
                        Exit
                    </Button>
                    </Link>
                ):(
                   isAdmin(userId!) ? (
                    <Link href="/teacher/courses">
                    <Button size="sm" variant="ghost">
                      Teacher mode
                    </Button>
                  </Link>
                   ) : null
                )
            }
            <UserButton/>
        </div>
        </>
     );
}
 
export default NavbarRoutes;