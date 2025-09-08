"use client"
import React, { useEffect, useState } from "react";
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders";
import { ForNavigationMessage } from "./ForNavigationMessage";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContextProvider";
import { getProjects } from "@/api/projects";

export const NavigationMessage = () => {

    const { token } = useUser();
    const [projects, setProjects] = useState<{ id: number }[]>([]);
  
    useEffect(() => {
      if (!token) return;
  
      const fetchProjects = async () => {
        try {
          const allProjects = await getProjects(token);
          setProjects(allProjects.map((p) => ({ id: p.id })));
        } catch (error) {
          console.error("Помилка завантаження проектів:", error);
        }
      };
  
      fetchProjects();
    }, [token]);

  return (
    <div className="relative w-[203px] min-h-[266px] bg-[#FFB32680] rounded p-2 mx-auto mt-30">
      <button className="absolute top-3 right-3">
        <X className="w-6 h-6 text-black hover:cursor-pointer" />
      </button>
      <ProjectsHeaders
        headers={["Прострочені платежі"]}
        className="text-black text-[18px] mt-10 font-inter text-center"
      />
      <ForNavigationMessage projectsMessage={projects}/>
    </div>
  );
};
