import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContextProvider";
import { getProjectPaymentsOverdue, Payment } from "@/api/payments";
import { ProjectDetailedResponse } from "@/types/project";
import { getProjectById } from "@/api/projects";

interface NavigationMessage {
  id: number;
}

interface Interaction {
  projectsMessage: NavigationMessage[];
}

interface PaymentWithProject {
  payment: Payment;
  project: ProjectDetailedResponse;
}

export const ForNavigationMessage = ({ projectsMessage }: Interaction) => {
  const { token } = useUser();
  const [combinedData, setCombinedData] = useState<PaymentWithProject[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const allPromises = projectsMessage.map(project => (
          Promise.all([
            getProjectPaymentsOverdue(project.id, token),
            getProjectById(project.id, token)]).then(([payments, project]) => 
          payments.map((payment) => ({ payment, project }))
        )))
        
        const results = (await Promise.all(allPromises)).flat();

        setCombinedData(results);
      } catch (error) {
        console.log("Error fetching navigation messages:", error);
      }
    };
    console.log(combinedData)
    fetchData();
  }, [projectsMessage, token]);

  return (
    <div className="px-2 mt-4 text-[14px] font-inter text-black space-y-2 text-center">
      {combinedData.map((item, index) => (
        <div key={index}>
          {index === 0 && <div className="border-t border-[#FFB326] mb-1" />}

          <div className="pb-2">
            <div>
              <span className="font-semibold">{item.project.name}</span>
            </div>
            <div>
              <span className="text-red-600 font-semibold">
                {item.payment.amount} грн
              </span>
            </div>
            <div>
              <span className="font-semibold">{item.project.description}</span>
            </div>
          </div>

          {index !== combinedData.length - 1 && (
            <div className="border-b border-[#FFB326] my-1" />
          )}
        </div>
      ))}
    </div>
  );
};
