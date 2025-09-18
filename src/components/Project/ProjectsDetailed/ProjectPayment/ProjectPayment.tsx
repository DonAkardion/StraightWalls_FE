"use client";
import React from "react";
import styles from "./ProjectPayment.module.css";
import { StageCard } from "./stageCard/stageCard";
import { ProjectReportResponse } from "@/types/project";
import { PaymentProjectDetails } from "@/components/Project/ProjectsDetailed/ProjectPayment/PaymentDetails/PaymentProjectDetails";
import { deletePayment, updatePaymentStatus } from "@/api/payments";
import { useUser } from "@/context/UserContextProvider";

interface Props {
  report: ProjectReportResponse;
  refreshProject: () => Promise<void>;
  role?: string;
}

function parseAmount(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const s = String(value).trim().replace(/\s+/g, "").replace(",", ".");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(value: number): string {
  return `${value.toLocaleString("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} грн`;
}

export function ProjectPayment({ report, refreshProject, role }: Props) {
  const { token } = useUser();
  const totalPaid = report.project.payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + parseAmount(p.amount), 0);

  const totalProjectCostNum = parseAmount(report.totalProjectCost);
  const totalLeftToPay = totalProjectCostNum - totalPaid;
  const advancePayment = report.project.payments.find(
    (p) => p.name === "Аванс"
  );
  return (
    <section className={`${styles.Payment} mb-[40px]`}>
      <div
        className={`${styles.generalStats} flex flex-col md:md:flex-col-reverse gap-[40px] md:gap-[60px] mb-[16px] md:mb-[32px]`}
      >
        <div
          className={`${styles.generalStatsTotal} flex flex-col md:flex-row gap-[24px] md:`}
        >
          <div className={`${styles.totalItem} `}>
            <span className={`${styles.totalItemText} `}>Загальна сума</span>
            <span className={`${styles.totalItemSum} `}>
              {formatCurrency(totalProjectCostNum)}
            </span>
          </div>
          <div className={`${styles.totalItem}`}>
            <span className={`${styles.totalItemText} `}>Оплачені кошти</span>
            <span className={`${styles.totalItemSum} `}>
              {formatCurrency(totalPaid)}
            </span>
          </div>
          <div className={`${styles.totalItem}`}>
            <span className={`${styles.totalItemText} `}>
              Залишок до оплати
            </span>
            <span className={`${styles.totalItemSum} `}>
              {formatCurrency(totalLeftToPay)}
            </span>
          </div>
        </div>
        <PaymentProjectDetails
          title="Оплата:"
          items={[
            {
              label: "Вартість усіх використанних матеріалів",
              value: formatCurrency(parseAmount(report.totalMaterialsCost)),
            },
            {
              label: "Вартість усіх виконаних робіт",
              value: formatCurrency(parseAmount(report.totalWorksCost)),
            },
            {
              label: "Аванс при заїзді бригади",
              value: advancePayment
                ? formatCurrency(parseAmount(advancePayment.amount))
                : "-",
            },
          ]}
        />
      </div>
      <div className={`${styles.stages} grid md:grid-cols-2 gap-[24px]`}>
        {report.project.payments.map((payment, idx) => (
          <StageCard
            key={payment.id}
            id={payment.id}
            title={`${payment.name}`}
            sum={`${parseAmount(payment.amount)} грн`}
            description={payment.description ?? ""}
            status={payment.status}
            role={role}
            onDelete={async (id) => {
              if (!token) return;
              await deletePayment(id, token);
              await refreshProject();
            }}
            onStatusChange={async (id, newStatus) => {
              if (!token) return;
              await updatePaymentStatus(id, newStatus, token);
              await refreshProject();
            }}
          />
        ))}
      </div>
    </section>
  );
}
