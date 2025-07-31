"use client";

import { Service, ServiceType } from "@/mock/Service/servicesMock";
import { Trash, Pen, Eye } from "../../../../public/icons";
import styles from "./ServiceList.module.css";

interface Props {
  services: Service[];
  type: ServiceType;
}

export const ServiceList = ({ services, type }: Props) => {
  const filtered = services.filter((s) => s.serviceType === type);

  return (
    <div className="">
      <h2 className={`${styles.serviceTytle} mb-[15px]`}>
        {type === "Основні послуги" ? "Основні послуги" : "Додаткові роботи"}
      </h2>
      <div className={`${styles.serviceTableWrap} rounded-[5px]`}>
        <table className={`${styles.serviceTable} w-full`}>
          <thead className={`${styles.serviceTableHead} md:h-[76px] h-[46px]`}>
            <tr className={styles.serviceTableTopRow}>
              <th className={`${styles.indentCell} hidden md:table-cell `}></th>
              <th className={`${styles.indentCell} hidden md:table-cell `}></th>
              <th
                className={`${styles.indentCellSmall} md:hidden table-cell w-[10px] `}
              ></th>
              <th
                className={`${styles.indentCellSmall} md:hidden table-cell w-[20px] `}
              ></th>
              <th className={styles.serviceTableRowCellName}>
                <span
                  className={`${styles.serviceTableRowCellTytle} hidden md:block`}
                >
                  Найменування послуги
                </span>
                <span
                  className={`${styles.serviceTableRowCellTytle} md:hidden block`}
                >
                  Назва
                </span>
              </th>
              <th className={styles.serviceTableRowCell}>Од. вимір.</th>
              <th className={styles.serviceTableRowCell}>Вартість, грн</th>
              <th className={styles.serviceTableRowCell}>Сума</th>
              <th className={styles.serviceTableRowCell}></th>
              <th className={styles.serviceTableRowCell}></th>

              <th className={`${styles.indentCell} md:hidden block `}></th>
              <th className={`${styles.indentCell} hidden md:block `}></th>
              <th className={styles.indentCell}></th>
            </tr>
          </thead>
          <tbody className={styles.serviceTableBody}>
            {filtered.map((service, index) => (
              <tr
                key={service.id}
                className={`${styles.serviceTableItem} ${styles.serviceTableRow}`}
              >
                <td
                  className={`${styles.indentCellSmall} md:hidden table-cell`}
                ></td>
                <td
                  className={`${styles.indentCell} hidden md:table-cell`}
                ></td>
                <td
                  className={`${styles.serviceTableItemNumber} ${styles.serviceTableCell}`}
                >
                  {index + 1}
                </td>
                <td
                  className={`${styles.serviceTableCell} ${styles.serviceTableItemName}`}
                >
                  <span className={styles.serviceTableRowCellText}>
                    {service.name}
                  </span>
                </td>
                <td
                  className={`${styles.serviceTableItemUnit} ${styles.serviceTableCell}`}
                >
                  {service.unit}
                </td>
                <td
                  className={`${styles.serviceTableItemPrice} ${styles.serviceTableCell}`}
                >
                  {service.price}
                </td>
                <td
                  className={`${styles.serviceTableItemSum} ${styles.serviceTableCell}`}
                >
                  {(service.price * service.amount).toFixed(2)}
                </td>
                <td
                  className={`${styles.serviceTableItemDelete} ${styles.serviceTableCell}`}
                >
                  <img
                    src={Pen.src}
                    alt="Edit"
                    className={`${styles.serviceTableItemIcon} w-[21px] h-[21px]`}
                  />
                </td>
                <td
                  className={`${styles.serviceTableItemEdit} ${styles.serviceTableCell}`}
                >
                  <img
                    src={Trash.src}
                    alt="Delete"
                    className={`${styles.serviceTableItemIcon} w-[21px] h-[21px]`}
                  />
                </td>
                <td
                  className={`${styles.serviceTableItemInspect} ${styles.serviceTableCell}`}
                >
                  <img
                    src={Eye.src}
                    alt="Inspect"
                    className={`${styles.serviceTableItemIcon} w-[21px] h-[21px]`}
                  />
                </td>
                <td className={styles.indentCell}></td>
                <td
                  className={`${styles.indentCell} hidden md:table-cell`}
                ></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className={`${styles.serviceTableBtn} h-[48px] mt-[38px] mr-[40px] mb-[38px] ml-[20px] rounded-[5px] w-[calc(100%-60px)]`}
        >
          Додати послугу
        </button>
      </div>
    </div>
  );
};
