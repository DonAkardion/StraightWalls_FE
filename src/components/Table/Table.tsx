"use client";

import React from "react";
import { Trash, Pen, Eye, EyeOpen } from "../../../public/icons";
import styles from "./Table.module.css";
import { TooltipWrapper } from "@/components/Table/TooltipWrapper/TooltipWrapper";
import Link from "next/link";

interface TableColumn<T> {
  key: keyof T | string;
  label: string | React.ReactNode;
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
  expandedId?: number | null;
  // передаємо класс для редизайну
  className?: string;
  // перехід до детального огляду
  onRowClick?: (id: number) => void;
  enableTooltips?: boolean;
  // Функція для отримання класу рядка за елементом даних
  getRowClassName?: (item: T) => string;
  showHeader?: boolean;
  // Функція для переходу на сторінку (Додати бригаду)
  addLink?: string;
  addLinkId?: string;
  // Додати назву кнопки
  addButtonText?: string;
}

export function Table<T extends { id: number }>({
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
  addLink,
  addLinkId,
  addButtonText,
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
                  onClick={() => onRowClick && onRowClick(item.id)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                  className={`${
                    expandedId === item?.id ? styles.noBottomBorderRow : ""
                  } ${getRowClassName ? getRowClassName(item) : ""}`}
                >
                  <td className="w-[10px] md:w-[20px]"></td>

                  {showIndex && (
                    <td className={`${styles.TableCell} ${styles.leftAlign}`}>
                      {index + 1}
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td
                      key={String(col.key)}
                      className={`${styles.TableCell} ${styles.truncateText} ${
                        colIndex < 1 ? styles.leftAlign : ""
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
                            onClick={(e) => {
                              e.stopPropagation();
                              onInspect(item);
                            }}
                            title="Закрити перегляд"
                          >
                            <img
                              src={EyeOpen.src}
                              alt="Inspect"
                              className={`${styles.TableItemIcon} ${styles.TableItemIconInspect} w-[21px] h-[21px] cursor-pointer`}
                            />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onInspect(item);
                            }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item);
                            }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item);
                            }}
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
                    <td
                      colSpan={columns.length + 1}
                      className=" sm:pl-[10px] pl-[6px] pr-[10px] "
                    >
                      {renderInspection(item)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {onAdd || addLink ? (
          <div
            className={`${styles.TableStickyButtonWrap} flex justify-center items-center`}
          >
            {addLink ? (
              <Link
                href={addLinkId ? `${addLink}/${addLinkId}` : addLink}
                className={`${styles.TableBtn} md:h-[48px] h-[35px] mt-[20px] mr-[10px] mb-0 ml-[10px] md:mt-[30px] md:mr-[40px] md:mb-0 md:ml-[20px] rounded-[5px] w-[calc(100%-20px)] md:w-[calc(100%-60px)] flex justify-center items-center`}
              >
                <span className={styles.TableBtnText}>{addButtonText}</span>
              </Link>
            ) : (
              <button
                className={`${styles.TableBtn} md:h-[48px] h-[35px] mt-[20px] mr-[10px] mb-0 ml-[10px] md:mt-[30px] md:mr-[40px] md:mb-0 md:ml-[20px] rounded-[5px] w-[calc(100%-20px)] md:w-[calc(100%-60px)]`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.();
                }}
              >
                <span className={styles.TableBtnText}>{addButtonText}</span>
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
