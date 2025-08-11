"use client";

import React from "react";
import { Trash, Pen, Eye } from "../../../public/icons";
import styles from "./Table.module.css";
import { TooltipWrapper } from "@/components/Table/TooltipWrapper/TooltipWrapper";

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  icon?: string | React.ReactNode;
  render?: (item: T) => React.ReactNode;
  tooltip?: (item: T) => string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  showIndex?: boolean;
  // Опціональні callbackи для операцій над рядком:
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onInspect?: (item: T) => void;
  // функція, яка повертає додатковий контент
  renderInspection?: (item: T) => React.ReactNode;
  // Опціональний callback для кнопки "Додати"
  onAdd?: () => void;
  // Прапорець або id поточного "розкритого" рядка (для inline деталей)
  expandedId?: string | null;
  // передаємо класс для редизайну
  className?: string;
  // перехід до детального огляду
  onRowClick?: (id: string) => void;
  enableTooltips?: boolean;
  // Функція для отримання класу рядка за елементом даних
  getRowClassName?: (item: T) => string;
  showHeader?: boolean;
}

export function Table<T extends { id: string }>({
  title,
  showIndex,
  data,
  columns,
  onEdit,
  onDelete,
  onInspect,
  onAdd,
  onRowClick,
  expandedId,
  renderInspection,
  enableTooltips,
  className,
  getRowClassName,
  showHeader = true,
}: TableProps<T>) {
  return (
    <div className=" ">
      {title && <h2 className={`${styles.Tytle} mb-[15px]`}>{title}</h2>}
      <div
        className={`${
          styles.TableWrap
        } relative rounded-[5px] pb-[20px] md:pb-[30px]  ${className || ""}`}
      >
        <table className={`${styles.Table} `}>
          {showHeader && (
            <thead className={`${styles.TableHead} md:h-[76px] h-[46px]`}>
              <tr className={styles.TableTopRow}>
                {showIndex && <th className={`${styles.indentCellBig}`}></th>}
                <th className={`${styles.indentCellBig} `}></th>
                <th className={`${styles.indentCellSmallFirst}`}></th>
                <th className={`${styles.indentCellSmallSecond}`}></th>
                {columns.map((col, index) => (
                  <th
                    key={String(col.key)}
                    className={`${styles.TableRowCell} ${
                      index < 1 ? styles.leftAlignHeader : ""
                    } ${styles.resizableColumn}`}
                  >
                    {col.label}
                  </th>
                ))}

                <th className={`${styles.indentCellBig}`}></th>
                <th className={`${styles.indentCellSmall}`}></th>
                <th className={`${styles.indentCellLast}`}></th>
                {/* {(onEdit || onDelete || onInspect) && (
                <th className={`${styles.TableRowCell}`}></th>
              )} */}
              </tr>
            </thead>
          )}
          <tbody className={styles.TableBody}>
            {data.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr
                  className={`${
                    expandedId === item.id ? styles.noBottomBorderRow : ""
                  } ${getRowClassName ? getRowClassName(item) : ""}`}
                >
                  <td className="w-[10px] md:w-[20px]"></td>

                  {showIndex && (
                    <td className={`${styles.TableCell} ${styles.leftAlign}`}>
                      {index + 1}
                    </td>
                  )}
                  {columns.map((col, index) => (
                    <td
                      onClick={() => onRowClick && onRowClick(item.id)}
                      style={{ cursor: onRowClick ? "pointer" : "default" }}
                      key={String(col.key)}
                      className={`${styles.TableCell} ${styles.truncateText} ${
                        index < 1 ? styles.leftAlign : ""
                      } ${styles.resizableColumn} `}
                    >
                      {enableTooltips && col.tooltip ? (
                        <TooltipWrapper tooltipText={col.tooltip(item)}>
                          <span>
                            {col.render
                              ? col.render(item)
                              : String(item[col.key as keyof T])}
                          </span>
                        </TooltipWrapper>
                      ) : col.render ? (
                        col.render(item)
                      ) : (
                        String(item[col.key as keyof T])
                      )}
                    </td>
                  ))}

                  {/* Стовпець з кнопкою Інспекту */}
                  {onInspect && (
                    <td
                      className={`${styles.TableCell} ${styles.TableCellInspect}`}
                    >
                      <div className=" flex justify-end pr-[10px]">
                        {expandedId === item.id ? (
                          <button
                            onClick={() => onInspect(item)}
                            title="Закрити перегляд"
                          >
                            {/* Перекреслене око */}
                            <svg
                              className={`${styles.TableItemIcon} ${styles.TableItemIconInspect} w-[21px] h-[21px] cursor-pointer`}
                              width="21"
                              height="21"
                              viewBox="0 0 25 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
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
                          </button>
                        ) : (
                          <button
                            onClick={() => onInspect(item)}
                            title="Переглянути"
                          >
                            <img
                              src={Eye.src}
                              alt="Inspect"
                              className={`${styles.TableItemIcon} ${styles.TableItemIconInspect} w-[21px] h-[21px] cursor-pointer`}
                            />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                  {/* Стовпець з кнопками Редагування та Видалення */}
                  {(onEdit || onDelete) && (
                    <td className={styles.TableCell}>
                      <div className="flex flex-row justify-end gap-[10px]">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            title="Редагувати"
                          >
                            <img
                              src={Pen.src}
                              alt="Edit"
                              className={`${styles.TableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                            />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            title="Видалити"
                          >
                            <img
                              src={Trash.src}
                              alt="Delete"
                              className={`${styles.TableItemIcon} w-[21px] h-[21px] cursor-pointer`}
                            />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="w-[10px] md:w-[40px]"></td>
                </tr>
                {expandedId === item.id && renderInspection && (
                  <tr className={`${styles.inspectTr}`}>
                    <td colSpan={columns.length + 1} className="p-[10px] ">
                      {renderInspection(item)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {onAdd && (
          <div
            className={`${styles.TableStickyButtonWrap} flex justify-center items-center`}
          >
            <button
              className={`${styles.TableBtn} md:h-[48px] h-[35px] mt-[12px] mr-[10px] mb-[12px] ml-[10px] md:mt-[38px] md:mr-[40px] md:mb-[38px] md:ml-[20px] rounded-[5px] w-[calc(100%-20px)] md:w-[calc(100%-60px)]`}
              onClick={onAdd}
            >
              <span className={styles.TableBtnText}>Додати послугу</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
