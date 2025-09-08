"use client";
import React, { useEffect, useState } from "react";
import { Balance } from "@/components/HomePage/Balance/Balance";
import { DriversBalance } from "@/components/HomePage/DriversBalance/DriversBalance";
import { Debtors } from "@/components/HomePage/Debtors/Debtors";
import { InProgress } from "@/components/HomePage/InProgress/InProgress";
import { getProjects, getProjectReport } from "@/api/projects";
import { getProjectPaymentsOverdue } from "@/api/payments";
import { ProjectReportResponse } from "@/types/project";
import { useUser } from "@/context/UserContextProvider";

interface DebtorItem {
  label: string;
  value: string;
}

export default function AdminHomePage() {
  const { token } = useUser();
  const [workProfit, setWorkProfit] = useState(0);
  const [materialsProfit, setMaterialsProfit] = useState(0);
  const [debtors, setDebtors] = useState<DebtorItem[]>([]);
  const [reports, setReports] = useState<ProjectReportResponse[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const projects = await getProjects(token);

        // Отримуємо звіти по всіх проєктах
        const reports = await Promise.all(
          projects.map((p) => getProjectReport(p.id, token))
        );

        const totalWork = reports.reduce(
          (sum, r) => sum + (r.totalWorksCost || 0),
          0
        );
        const totalMaterials = reports.reduce(
          (sum, r) => sum + (r.totalMaterialsProfit || 0),
          0
        );

        setWorkProfit(totalWork);
        setMaterialsProfit(totalMaterials);
        setReports(reports);

        // Отримуємо просрочені платежі по всіх проєктах
        const overduePayments = await Promise.all(
          projects.map(async (p) => {
            const overdue = await getProjectPaymentsOverdue(p.id, token);
            return { project: p, overdue };
          })
        );

        // Список боржників (ті, де є сума > 0)
        const debtorsList: DebtorItem[] = overduePayments
          .filter(({ overdue }) => overdue.length > 0)
          .map(({ project, overdue }) => {
            const totalAmount = overdue.reduce(
              (sum, pay) => sum + Number(pay.amount || 0),
              0
            );
            return {
              label: project.name,
              value: totalAmount.toLocaleString(),
            };
          });

        setDebtors(debtorsList);

        // Загальний борг
        const totalDebtValue = overduePayments.reduce(
          (sum, { overdue }) =>
            sum +
            overdue.reduce(
              (subSum, pay) => subSum + Number(pay.amount || 0),
              0
            ),
          0
        );

        setTotalDebt(totalDebtValue);
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <section className="flex flex-col max-w-[1126px] mx-auto pt-[24px] pr-[20px] pb-[40px] pl-[20px] md:pt-[64px] md:pr-[60px] md:pb-[76px] md:pl-[80px]">
      <Balance
        items={[
          { label: "Гроші в касі", value: "345" },
          { label: "Борг", value: totalDebt.toLocaleString() || "0" },
          {
            label: "Заробіток на роботі",
            value: workProfit.toLocaleString() || "0",
          },
          {
            label: "Заробіток на матеріалах",
            value: materialsProfit.toLocaleString() || "0",
          },
        ]}
      />
      <DriversBalance
        items={[
          { label: "Олег Петрович", value: "1 057,5" },
          { label: "Максим Іванович", value: "10 057,5" },
          { label: "Олекса Володимирович", value: "157,5" },
        ]}
      />
      <InProgress reports={reports} />
      <Debtors items={debtors} />
    </section>
  );
}
