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

export default function WorkerHomePage() {
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

        /// Debtors
        const overduePayments = await Promise.all(
          projects.map(async (p) => {
            const overdue = await getProjectPaymentsOverdue(p.id, token);
            return { project: p, overdue };
          })
        );

        const debtorsList: DebtorItem[] = overduePayments
          .filter(({ overdue }) => overdue.amount && overdue.amount > 0)
          .map(({ project, overdue }) => ({
            label: project.name,
            value: overdue.amount.toLocaleString(),
          }));

        setDebtors(debtorsList);

        const totalDebtValue = overduePayments.reduce(
          (sum, { overdue }) => sum + (overdue.amount || 0),
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
      {/* тут будуть Worker-модулі */}
      <DriversBalance items={[{ label: "Олег Петрович", value: "1 057,5" }]} />
      <InProgress reports={reports} />
    </section>
  );
}
