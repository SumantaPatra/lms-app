import Logo from "./logo";
import SideBarRoutes from "./sidebar-route";

const SideBar = () => {
    return ( 
        <div className="h-full border-r-2 bg-white shadow-sm flex flex-col">
            <div className="p-6 flex items-center gap-2">
                <Logo/>
                <span className="font-bold text-[#6495ED]">CourseCraft</span>
            </div>
            <div className="">
             <SideBarRoutes/>
            </div>
        </div>
     );
}
 
export default SideBar;