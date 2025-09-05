"use client";
import React, { useEffect, useState } from "react";
import {
  ChartOptions,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./GraphicChart.module.css";
import { getProjectPayments } from "@/api/payments";
import { useUser } from "@/context/UserContextProvider";
import { getProjectReport } from "@/api/projects";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const months = [
  "Січень","Лютий","Березень","Квітень","Травень","Червень",
  "Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"
];

type ChartType = "Продажі" | "Прибуток" | "Витрати";

interface Project {
  id: number;
}

interface Props {
  projects: Project[];
}

export const GraphicChart = ({ projects }: Props) => {
  const buttonsTitle: ChartType[] = ["Продажі", "Прибуток", "Витрати"];
  const [active, setActive] = useState<ChartType>("Продажі");

  const [salesData, setSalesData] = useState<number[]>(new Array(12).fill(0));
  const [profitData, setProfitData] = useState<number[]>(new Array(12).fill(0));
  const [expensesData, setExpensesData] = useState<number[]>(new Array(12).fill(0));

  const { token } = useUser();

  useEffect(() => {
    if (!token || !projects.length) return;

    const fetchAllPayments = async () => {
      try {
        const monthlySales = new Array(12).fill(0);
        for (const project of projects) {
          const payments = await getProjectPayments(project.id, token);
          const paidPayments = payments.filter((p) => p.status === "paid");
          paidPayments.forEach((payment) => {
            const date = new Date(payment.updated_at);
            const monthIndex = date.getMonth();
            const amount = Number(payment.amount);
            if (!isNaN(monthIndex) && !isNaN(amount)) {
              monthlySales[monthIndex] += amount;
            }
          });
        }

        setSalesData(monthlySales);
      } catch (error) {
        console.error("Помилка завантаження платежів:", error);
      }
    };

    fetchAllPayments();
  }, [projects, token]);

  useEffect(() => {
    if (!token || !projects.length) return;

    const fetchExpenses = async () => {
      try {
        const monthlyExpenses = new Array(12).fill(0);

        for (const project of projects) {
          const report = await getProjectReport(project.id, token);
          const updatedMonth = new Date(report.project.updated_at).getMonth();
          const expense = Number(report.totalMaterialsCost);
          if (!isNaN(updatedMonth) && !isNaN(expense)) {
            monthlyExpenses[updatedMonth] += expense;
          }
        }

        setExpensesData(monthlyExpenses);
      } catch (error) {
        console.error("Помилка завантаження витрат:", error);
      }
    };

    fetchExpenses();
  }, [projects, token]);


    useEffect(() => {
      if (!salesData.length || !expensesData.length) return;

      const monthlyProfits = salesData.map((sale, index) => {
        const expense = expensesData[index] || 0;
        return sale - expense;
      });

      setProfitData(monthlyProfits);
    }, [salesData, expensesData]);


  const chartData = {
    labels: months,
    datasets: [
      {
        label: active,
        data:
          active === "Продажі"
            ? salesData
            : active === "Прибуток"
            ? profitData
            : expensesData,
        fill: true,
        backgroundColor: "rgba(255, 165, 0, 0.3)",
        tension: 0.6,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    layout: { padding: { right: 30 } },
    plugins: { legend: { display: false } },
    scales: {
      y: {
        position: "right",
        beginAtZero: false,
        min: 0,
        max: 200000,
        ticks: {
          stepSize: 50000,
          callback: (value) =>
            typeof value === "number" ? value.toLocaleString("uk-UA") : "",
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size:
              typeof window !== "undefined" && window.innerWidth <= 780
                ? 10
                : 12,
          },
        },
      },
    },
  };

  return (
    <div className={`mt-15 ${styles.graphicChart}`}>
      <h2 className={`text-[36px] mb-2 ${styles.graphicChartTitle}`}>
        Звіт по місяцях
      </h2>
      <div className={`${styles.graphiChart} bg-white p-8 rounded-lg`}>
        <div className={`mb-4 space-x-2 ${styles.graphicChartButtons}`}>
          {buttonsTitle.map((title) => (
            <button
              key={title}
              onClick={() => setActive(title)}
              className={`hover:cursor-pointer border border-[#FFB32680] px-6 py-1 rounded ${
                active === title ? "bg-[#FFB32680] font-semibold" : "bg-white"
              }`}
            >
              {title}
            </button>
          ))}
        </div>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
