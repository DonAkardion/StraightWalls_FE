import React, { useEffect, useState } from "react";
import styles from "./ClientsBenefit.module.css";
import { getProjectByClientId } from "@/api/projects";

interface Props {
  clientId: number;
}

interface BenefitProps {
  worksSum: number;
  materialsSum: number;
  benefit: number;
}

export const ClientsBenefit = ({ clientId }: Props) => {
  const [benefitData, setBenefitData] = useState<BenefitProps[]>([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchBenefitData = async () => {
      try {
        const data = await getProjectByClientId(clientId, token);

        const mappedBenefitData: BenefitProps[] = Array.isArray(data)
          ? data.map((p: any) => {
              const worksSum = p.works?.reduce(
                (sum: number, w: any) => sum + Number(w.cost ?? 0),
                0
              ) ?? 0;

              const materialsSum = p.materials?.reduce(
                (sum: number, m: any) => sum + Number(m.selling_price ?? 0),
                0
              ) ?? 0;

              return {
                worksSum,
                materialsSum,
                benefit: worksSum + materialsSum,
              };
            })
          : [];

        setBenefitData(mappedBenefitData);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchBenefitData();
  }, [token, clientId]);

  const totalWorks = benefitData.reduce((sum, b) => sum + b.worksSum, 0);
  const totalMaterials = benefitData.reduce((sum, b) => sum + b.materialsSum, 0);
  const totalBenefit = benefitData.reduce((sum, b) => sum + b.benefit, 0);

  return (
    <section className="w-full text-center mt-15">
      <div className={`${styles.clientsProfit} mt-5 rounded py-10`}>
        <p className={styles.clientsLabel}>Дохід від клієнта</p>
        <h1 className={styles.clientsPrice}>
          {totalBenefit.toLocaleString("uk-UA", { style: "currency", currency: "UAH" })}
        </h1>
      </div>

      <div className={`${styles.clientsProfit} mt-5 rounded`}>
        <div className="flex justify-between items-center">
          <p className={styles.clientsLabel}>Вартість усіх виконаних робіт</p>
          <h2 className={styles.clientsPrice}>
            {totalWorks.toLocaleString("uk-UA", { style: "currency", currency: "UAH" })}
          </h2>
        </div>
      </div>

      <div className={`${styles.clientsProfit} mt-5 rounded`}>
        <div className="flex justify-between items-center">
          <p className={styles.clientsLabel}>Вартість усіх використаних матеріалів</p>
          <h2 className={styles.clientsPrice}>
            {totalMaterials.toLocaleString("uk-UA", { style: "currency", currency: "UAH" })}
          </h2>
        </div>
      </div>
    </section>
  );
};
