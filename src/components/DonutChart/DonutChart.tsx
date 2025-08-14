"use client";
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Plugin
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { mockProjects } from "@/mock/Project/mockProjects";
import styles from "./DonutChart.module.css"

ChartJS.register(ArcElement, Tooltip);

const centerTextPlugin: Plugin = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx, chartArea: { width, height, left, top } } = chart;
    ctx.save();

    const dataset = chart.data.datasets[0];
    const total = dataset.data.reduce((acc, val) => acc + Number(val), 0);
    const doneIndex = chart.data.labels.indexOf("Done");
    const doneValue = doneIndex >= 0 ? Number(dataset.data[doneIndex]) : 0;
    const percent = total > 0 ? Math.round((doneValue / total) * 100) : 0;

    ctx.font = "bold 28px 'Jura'";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, left + width / 2, top + height / 2);
    ctx.restore();
  }
};

export const DoughnutChart = () => {
  const tasksStatus: Record<string, number> = {};

  mockProjects.forEach(project => {
    const status = project.status;
    tasksStatus[status] = (tasksStatus[status] || 0) + 1;
  });

  const orderedStatuses = ["Done", "In progress", "Waiting", "Canceled"];
  const filteredSortedLabels = orderedStatuses.filter(s => s in tasksStatus);
  const dataValues = filteredSortedLabels.map(label => tasksStatus[label]);
  const total = dataValues.reduce((acc, val) => acc + val, 0);

  const colors: Record<string, string> = {
    "Done": "#15ae08",
    "In progress": "#0097c0",
    "Waiting": "#ffb32680",
    "Canceled": "#b70000"
  };

  const ukrLabels: Record<string, string> = {
    "Done": "Виконано",
    "In progress": "В процесі",
    "Waiting": "Очікує",
    "Canceled": "Відхилено"
  };

  const data = {
    labels: filteredSortedLabels,
    datasets: [
      {
        label: "Кількість проєктів",
        data: dataValues,
        backgroundColor: filteredSortedLabels.map(l => colors[l]),
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    cutout: "75%",
    radius: "95%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = total ? ((value / total) * 100).toFixed(0) : "0";
            return `${label}: ${percentage}%`;
          }
        }
      }
    }
  };

  const leftColumn = ["Done", "In progress"];
  const rightColumn = ["Waiting", "Canceled"];

  const renderLegendItem = (label: string) => {
    const value = tasksStatus[label];
    const percentage = total ? ((value / total) * 100).toFixed(0) : "0";
    return (
      <div key={label} className="flex items-center mb-4">
        <div
          className="w-13 h-13 rounded-full text-white flex items-center justify-center font-bold mr-4 shadow-xl"
          style={{ backgroundColor: colors[label] }}
        >
          {percentage}%
        </div>
        <span className={`${styles.ukrLabel}`}>{ukrLabels[label]}</span>
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-around bg-white p-5 rounded-lg h-[250px] mb-10 ${styles.donutChart}`}>
      <div className={`w-[180px] ${styles.chartContainer}`}>
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
      <div className={`flex flex-col justify-center ${styles.legendBlock}`}>
        <h3 className={`mb-5 text-center font-semibold ${styles.legendTitle}`}>Виконання проєктів</h3>
        <div className="flex gap-10">
          <div>{leftColumn.map(renderLegendItem)}</div>
          <div>{rightColumn.map(renderLegendItem)}</div>
        </div>
      </div>
    </div>
  );
};
