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
        const results: PaymentWithProject[] = [];

        for (const project of projectsMessage) {
          const paymentResponse: any = await getProjectPaymentsOverdue(project.id, token);
          const paymentsArray: Payment[] = paymentResponse.data ? paymentResponse.data : [paymentResponse];
          const projectResponse = await getProjectById(project.id, token);

          paymentsArray.forEach((payment) => {
            results.push({ payment, project: projectResponse });
          });
        }

        setCombinedData(results);
      } catch (error) {
        console.log("Error fetching navigation messages:", error);
      }
    };

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

          {index === 0 && <div className="border-b border-[#FFB326] mt-1" />}
        </div>
      ))}
    </div>
  );
};
