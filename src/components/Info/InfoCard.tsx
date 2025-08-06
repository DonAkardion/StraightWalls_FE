import styles from "./InfoCard.module.css";

export const InfoCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="w-full m-auto md:m-0 max-w-[500px] md:w-[calc(100%-72px)] shadow-[1px_3px_15px_2px_#00000040] rounded-[5px] custom-yellow-gradient pt-[24px] pb-[24px] text-center">
    <div className="mb-[8px]">
      <h5 className={`${styles.cardLabel}`}>{label}</h5>
    </div>
    <div className="">
      <h4 className={`${styles.cardValue}`}>{value}</h4>
    </div>
  </div>
);
