"use client";
import React, { useEffect, useState } from "react";
import { ProjectsHeaders } from "@/features/projects/ProjectHeaders";
import { ForNavigationMessage } from "./ForNavigationMessage";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContextProvider";
import { getProjects } from "@/api/projects";
import { getProjectPaymentsOverdue } from "@/api/payments";
import { ProjectResponse } from "@/types/project";

interface OverduePayment {
  projectName: string;
  amount: number;
}

export const NavigationMessage = () => {
  const { token } = useUser();
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchOverdue = async () => {
      try {
        const allProjects: ProjectResponse[] = await getProjects(token);

        const allPromises = allProjects.map((project) =>
          getProjectPaymentsOverdue(project.id, token).then((payments) =>
            payments.map((payment) => ({
              projectName: project.name,
              amount: payment.amount,
            }))
          )
        );

        const results = (await Promise.all(allPromises)).flat();
        setOverduePayments(results);
      } catch (error) {
        console.error("Помилка завантаження прострочених платежів:", error);
      }
    };

    fetchOverdue();
  }, [token]);

  if (!overduePayments.length) return null;

  return (
    <div className="relative w-[203px] min-h-[266px] bg-[#FFB32680] rounded p-2 mx-auto mt-30">
      <button className="absolute top-3 right-3">
        <X className="w-6 h-6 text-black hover:cursor-pointer" />
      </button>
      <ProjectsHeaders
        headers={["Прострочені платежі"]}
        className="text-black text-[18px] mt-10 font-inter text-center"
      />
      <ForNavigationMessage data={overduePayments} />
    </div>
  );
};
