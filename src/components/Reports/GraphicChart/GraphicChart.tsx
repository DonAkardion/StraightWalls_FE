"use client";
import React from "react";
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
import { useState } from "react";
import styles from "./GraphicChart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type ChartType = "Продажі" | "Прибуток" | "Витрати";

const months = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

const dataSets: Record<ChartType, number[]> = {
  Продажі: [
    12000, 8000, 11000, 14000, 12000, 16000, 15000, 18000, 19000, 17000, 15500,
    16500,
  ].map((x) => x * 10),
  Прибуток: [
    4000, 5500, 6000, 2500, 2900, 3000, 2800, 3500, 4000, 4100, 4300, 5000,
  ].map((x) => x * 10),
  Витрати: [
    10000, 9000, 9500, 11500, 9800, 13000, 12200, 14500, 17000, 13700, 12400,
    12900,
  ].map((x) => x * 10),
};

export const GraphicChart = () => {
  const buttonsTitle: ChartType[] = ["Продажі", "Прибуток", "Витрати"];
  const [active, setActive] = useState<ChartType>("Продажі");

  const chartData = {
    labels: months,
    datasets: [
      {
        label: active,
        data: dataSets[active],
        fill: true,
        backgroundColor: "rgba(255, 165, 0, 0.3)",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        type: "linear",
        position: "right",
        min: 10000,
        max: 200000,
        ticks: {
          stepSize: 10000,
          padding: 10,
          callback: (value) => {
            const allowed = [10000, 50000, 100000, 150000, 200000];
            if (typeof value === "number" && allowed.includes(value)) {
              return value.toLocaleString("uk-UA");
            }
            return "";
          },
        },
        grid: {
          drawTicks: false,

          color: (ctx) => {
            const val = ctx.tick?.value;
            const allowed = [10000, 50000, 100000, 150000, 200000];
            return allowed.includes(val ?? 0) ? "#000000" : "transparent";
          },
        },
      },
      x: {
        type: "category",
        grid: { display: false },
        ticks: { maxRotation: 45, minRotation: 45 },
      },
    },
    elements: {
      line: { borderWidth: 1, tension: 0.4 },
      point: { radius: 0 },
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
