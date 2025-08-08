<<<<<<< HEAD
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders"
import { ForNavigationMessage } from "./ForNavigationMessage"
import { X } from "lucide-react";

export const NavigationMessage = () => {
    return (
        <div className="relative w-[203px] h-[266px] bg-[#FFB32680] rounded p-2 mx-auto mt-30">
            <button className="absolute top-3 right-3">
                <X className="w-6 h-6 text-black" />
            </button>
            <ProjectsHeaders
                headers={["Прострочені платежі"]}
                className="text-black text-[12px] text-center mt-10 font-inter"
            />
            <ForNavigationMessage />
        </div>
    )
}
=======
import React from "react";
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders";
import { ForNavigationMessage } from "./ForNavigationMessage";
import { X } from "lucide-react";

export const NavigationMessage = () => {
  return (
    <div className="relative w-[203px] h-[266px] bg-[#FFB32680] rounded p-2 mx-auto mt-30">
      <button className="absolute top-3 right-3">
        <X className="w-6 h-6 text-black" />
      </button>
      <ProjectsHeaders
        headers={["Прострочені платежі"]}
        className="text-black text-[12px] text-center mt-10 font-inter"
      />
      <ForNavigationMessage />
    </div>
  );
};
>>>>>>> 61c49fb4092e629ee3e6ba62acc2616082680b58
