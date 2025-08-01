"use client";

import React from "react";
import { useState } from "react";
import { Service, ServiceType } from "@/types/service";
import { Trash, Pen, Eye } from "../../../../public/icons";
import styles from "./ServiceList.module.css";

interface Props {
  services: Service[];
  type: ServiceType;
  onDelete: (id: string) => void;
  onEdit: (updated: Service) => void;
  onAdd: () => void;
}

export const ServiceList = ({
  services,
  type,
  onDelete,
  onEdit,
  onAdd,
}: Props) => {
  const filtered = services.filter((s) => s.serviceType === type);
  const [inspectedService, setInspectedService] = useState<Service | null>(
    null
  );
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleInspectClick = (
    event: React.MouseEvent<Element>,
    service: Service
  ) => {
    if (inspectedService?.id === service.id) {
      setInspectedService(null);
    } else {
      setInspectedService(service);
    }
  };

  return (
    <div className="  ">
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
              <React.Fragment key={service.id}>
                <tr
                  key={service.id}
                  className={` ${styles.serviceTableItem} ${
                    styles.serviceTableRow
                  } ${
                    inspectedService?.id === service.id
                      ? styles.noBottomBorderRow
                      : ""
                  }`}
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
                      className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                      onClick={() => onEdit(service)}
                    />
                  </td>
                  <td
                    className={`${styles.serviceTableItemEdit} ${styles.serviceTableCell}`}
                  >
                    <img
                      src={Trash.src}
                      alt="Delete"
                      className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                      onClick={() => onDelete(service.id)}
                    />
                  </td>
                  <td
                    className={`${styles.serviceTableItemInspect} ${styles.serviceTableCell}`}
                  >
                    {inspectedService?.id === service.id ? (
                      // Перекреслене око (open)
                      <svg
                        className={`${styles.serviceTableItemIconInspect} cursor-pointer`}
                        width="21"
                        height="27"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={(e) => handleInspectClick(e, service)}
                      >
                        <path
                          d="M12.5 18C6.98 18 2.5 12 2.5 12C2.5 12 6.98 6 12.5 6C18.02 6 22.5 12 22.5 12C22.5 12 18.02 18 12.5 18Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.5 14.5C13.8807 14.5 15 13.3807 15 12C15 10.6193 13.8807 9.5 12.5 9.5C11.1193 9.5 10 10.6193 10 12C10 13.3807 11.1193 14.5 12.5 14.5Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22.5 2L2.5 22"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      // Звичайне око (closed)
                      <img
                        src={Eye.src}
                        alt="Inspect"
                        className={`${styles.serviceTableItemIcon} ${styles.serviceTableItemIconInspect} w-[21px] h-[21px] cursor-pointer`}
                        onClick={(e) => handleInspectClick(e, service)}
                      />
                    )}
                  </td>
                  <td className={`${styles.indentCell} relative `}></td>
                  <td
                    className={`${styles.indentCell} hidden md:table-cell`}
                  ></td>
                </tr>
                {inspectedService?.id === service.id && (
                  <tr>
                    <td colSpan={13}>
                      <div className="pl-[20px] pt-2 pb-1 flex flex-col gap-2  ml-[10px] mr-[20px] bg-white border-b-1 relative">
                        <div
                          className={`${styles.inspectRow} flex justify-between`}
                        >
                          <p className="text-sm ">
                            <span>Од. виміру:</span>{" "}
                            {service.amount || "немає опису"}
                          </p>
                          <img
                            src={Trash.src}
                            alt="Delete"
                            className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                            onClick={() => onDelete(service.id)}
                          />
                        </div>
                        <div
                          className={`${styles.inspectRow} flex justify-between`}
                        >
                          <p className="text-sm ">
                            <span>Ціна:</span> {service.price}
                          </p>

                          <img
                            src={Pen.src}
                            alt="Edit"
                            className={`${styles.serviceTableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                            onClick={() => onEdit(service)}
                          />
                        </div>
                        <p className="text-sm ">
                          <span>Сума:</span>{" "}
                          {(service.price * service.amount).toFixed(2)}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button
          className={`${styles.serviceTableBtn} md:h-[48px] h-[35px] mt-[12px] mr-[10px] mb-[12px] ml-[10px] md:mt-[38px] md:mr-[40px] md:mb-[38px] md:ml-[20px] rounded-[5px] w-[calc(100%-20px)] md:w-[calc(100%-60px)]`}
          onClick={onAdd}
        >
          Додати послугу
        </button>
      </div>
    </div>
  );
};
