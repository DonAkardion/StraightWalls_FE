"use client";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Plugin } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./DonutChart.module.css";
import { TooltipItem } from "chart.js";
import { getProjects } from "@/api/projects";
import { ProjectStatus } from "@/types/project";

ChartJS.register(ArcElement, Tooltip);

interface DonutProps {
  status: string
}

const centerTextPlugin: Plugin = {
  id: "centerText",
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { width, height, left, top },
    } = chart;
    ctx.save();

    const dataset = chart.data.datasets[0];
    const data = dataset.data as number[];
    const total = data.reduce((acc, val) => acc + val, 0);

    if (total === 0) return;

    const maxValue = Math.max(...data);
    const percent = Math.round((maxValue / total) * 100);

    ctx.font = "bold 28px 'Jura'";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, left + width / 2, top + height / 2);

    ctx.restore();
  },
};


export const DoughnutChart = () => {
  const [donutChartData, setDonutChartData] = useState<DonutProps[]>([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken!)
  }, [token])

  useEffect(() => {
    if (!token) return;

    const fetchDonutData = async () => {
      try {
        const data = await getProjects(token);
        setDonutChartData(data)
      } catch (error) {
        console.log("Error:", error)
      }
    }
    fetchDonutData();
  }, [token])

  console.log(donutChartData)
  const tasksStatus: Record<ProjectStatus, number> = {} as Record<ProjectStatus, number>;

  donutChartData.forEach((project) => {
    const status = project.status as ProjectStatus;
    tasksStatus[status] = (tasksStatus[status] || 0) + 1;
  });

  const orderedStatuses = [ProjectStatus.COMPLETED, ProjectStatus.IN_PROGRESS, ProjectStatus.NEW, ProjectStatus.CANCELED];
  const filteredSortedLabels = orderedStatuses.filter((s) => s in tasksStatus);
  const dataValues = filteredSortedLabels.map((label) => tasksStatus[label]);
  const total = dataValues.reduce((acc, val) => acc + val, 0);

  const colors: Partial<Record<ProjectStatus, string>> = {
    [ProjectStatus.COMPLETED]: "#15ae08",
    [ProjectStatus.IN_PROGRESS]: "#0097c0",
    [ProjectStatus.NEW]: "#ffb32680",
    [ProjectStatus.CANCELED]: "#b70000"
    // [ProjectStatus.CONFIRMED]: "#1b6a14ff",
    // [ProjectStatus.SCHEDULED]: "#0f5669ff"
  };

  const ukrLabels: Partial<Record<ProjectStatus, string>> = {
    [ProjectStatus.COMPLETED]: "Виконано",
    [ProjectStatus.IN_PROGRESS]: "В процесі",
    [ProjectStatus.NEW]: "Очікує",
    [ProjectStatus.CANCELED]: "Відхилено"
    // [ProjectStatus.CONFIRMED]: "Підтверджено",
    // [ProjectStatus.SCHEDULED]: "Заплановано"
  };

  const data = {
    labels: filteredSortedLabels,
    datasets: [
      {
        label: "Кількість проєктів",
        data: dataValues,
        backgroundColor: filteredSortedLabels.map((l) => colors[l]),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "75%",
    radius: "95%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = total ? ((value / total) * 100).toFixed(0) : "0";
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  const leftColumn = [ProjectStatus.COMPLETED, ProjectStatus.IN_PROGRESS];
  const rightColumn = [ProjectStatus.NEW, ProjectStatus.CANCELED];
  // const centerColumn = [ProjectStatus.CONFIRMED, ProjectStatus.SCHEDULED];


  const renderLegendItem = (status: ProjectStatus) => {
  const value = tasksStatus[status] || 0;
  const percentage = total ? ((value / total) * 100).toFixed(0) : "0";
  return (
    <div key={status} className="flex gap-3 items-center mb-4">
      <div
        className="w-13 h-13 rounded-full text-white flex items-center justify-center font-bold shadow-xl"
        style={{ backgroundColor: colors[status] }}
      >
        {percentage}%
      </div>
      <span className={`${styles.ukrLabel}`}>{ukrLabels[status]}</span>
    </div>
  );
};


  return (
    <div
      className={`flex items-center justify-around bg-white p-5 rounded-lg h-[250px] mb-10 ${styles.donutChart}`}
    >
      <div className={`max-w-[180px] ${styles.chartContainer}`}>
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
      <div className={`flex flex-col justify-center ${styles.legendBlock}`}>
        <h3 className={`mb-5 text-center font-semibold ${styles.legendTitle}`}>
          Виконання проєктів
        </h3>
        <div className="flex gap-10">
          <div className={`${styles.leftLegendBlock}`}>
            {leftColumn.map(renderLegendItem)}
          </div>
          <div className={`${styles.rightLegendBlock}`}>
            {rightColumn.map(renderLegendItem)}
          </div>
        </div>
      </div>
    </div>
  );
};
