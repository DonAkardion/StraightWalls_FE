import React, { useEffect, useState } from "react";
import styles from "./ClientsBenefit.module.css";
import { getProjectByClientId, getProjectReport } from "@/api/projects";
import { ProjectResponse, Project } from "@/types/project";

interface Props {
  clientId: number;
}

interface ProjectReport {
  totalWorksCost: number;
  totalMaterialsCost: number;
  totalProjectCost: number;
  projectName?: string;
}

export const ClientsBenefit = ({ clientId }: Props) => {
  const [benefitData, setBenefitData] = useState<ProjectReport | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchBenefitData = async () => {
      try {
        const projects: ProjectResponse[] = (await getProjectByClientId(
          clientId,
          token
        )) as Project[];
        // const projects = await getProjectByClientId(clientId, token);
        const reports: ProjectReport[] = await Promise.all(
          projects.map((p: any) => getProjectReport(p.id, token))
        );

        const totalWorksCost = reports.reduce(
          (sum, r) => sum + r.totalWorksCost,
          0
        );
        const totalMaterialsCost = reports.reduce(
          (sum, r) => sum + r.totalMaterialsCost,
          0
        );
        const totalProjectCost = reports.reduce(
          (sum, r) => sum + r.totalProjectCost,
          0
        );

        setBenefitData({
          totalWorksCost,
          totalMaterialsCost,
          totalProjectCost,
        });
      } catch (error) {
        console.error("Error fetching benefit data:", error);
      }
    };

    fetchBenefitData();
  }, [token, clientId]);

  if (!benefitData) {
    return <p>Завантаження...</p>;
  }

  return (
    <section className="w-full text-center mt-15">
      <div className={`${styles.clientsProfit} mt-5 rounded py-10`}>
        <p className={styles.clientsLabel}>Дохід від клієнта</p>
        <h1 className={styles.clientsPrice}>
          {benefitData.totalProjectCost.toLocaleString("uk-UA", {
            style: "currency",
            currency: "UAH",
          })}
        </h1>
      </div>

      <div className={`${styles.clientsProfit} mt-5 rounded`}>
        <div className="flex justify-between items-center">
          <p className={styles.clientsLabel}>Вартість усіх виконаних робіт</p>
          <h2 className={styles.clientsPrice}>
            {benefitData.totalWorksCost.toLocaleString("uk-UA", {
              style: "currency",
              currency: "UAH",
            })}
          </h2>
        </div>
      </div>

      <div className={`${styles.clientsProfit} mt-5 rounded`}>
        <div className="flex justify-between items-center">
          <p className={styles.clientsLabel}>
            Вартість усіх використаних матеріалів
          </p>
          <h2 className={styles.clientsPrice}>
            {benefitData.totalMaterialsCost.toLocaleString("uk-UA", {
              style: "currency",
              currency: "UAH",
            })}
          </h2>
        </div>
      </div>
    </section>
  );
};
