"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./SettingsTable.module.css";

interface Props {
  columns: string[];
  initialValues?: (number | null)[];
  onTotalsChange?: (totals: number[]) => void;
}

export function SettingsTable({
  columns,
  initialValues = [],
  onTotalsChange,
}: Props) {
  const [rows, setRows] = useState<(number | null)[][]>([]);

  const normalizeInit = (): (number | null)[] =>
    columns.map((_, i) => {
      const v = initialValues[i];
      return v == null ? null : Number(v);
    });

  const prevInitRef = useRef<(number | null)[] | null>(null);

  const isEqual = (a: (number | null)[] | null, b: (number | null)[]) => {
    if (!a) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  useEffect(() => {
    const nextInit = normalizeInit();
    if (!isEqual(prevInitRef.current, nextInit)) {
      setRows([
        nextInit,
        ...Array.from({ length: 2 }, () => columns.map(() => null)),
      ]);
      prevInitRef.current = nextInit;
    }
  }, [initialValues, columns]);

  const handleChange = (rowIndex: number, colIndex: number, value: string) => {
    setRows((prev) => {
      const copy = prev.map((r) => [...r]);
      const parsed =
        value.trim() === "" ? null : parseFloat(value.replace(",", "."));
      copy[rowIndex][colIndex] = Number.isFinite(parsed) ? parsed : null;
      return copy;
    });
  };

  const addRow = () => setRows((prev) => [...prev, columns.map(() => null)]);

  const totals = columns.map((_, colIndex) =>
    rows.reduce((sum, row) => {
      const v = row[colIndex];
      return sum + (typeof v === "number" ? v : 0);
    }, 0)
  );

  const prevTotalsRef = useRef<number[] | null>(null);
  useEffect(() => {
    if (!onTotalsChange) return;
    const prev = prevTotalsRef.current;
    const same =
      prev &&
      prev.length === totals.length &&
      prev.every((v, i) => v === totals[i]);

    if (!same) {
      onTotalsChange(totals);
      prevTotalsRef.current = totals;
    }
  }, [totals, onTotalsChange]);

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${columns.length}, minmax(94px,86px))`,
  };

  return (
    <div className="mb-[40px] ">
      <div className={`${styles.Table} overflow-x-auto rounded-[5px]`}>
        <div className="min-w-max">
          {/* Верхній рядок — заголовки */}
          <div
            className={`${styles.TableTopRow} grid px-[20px] py-[10px]`}
            style={gridStyle}
          >
            {columns.map((col, i) => (
              <div key={i} className="p-2 text-center">
                {col}
              </div>
            ))}
          </div>

          {/* Тіло таблиці */}
          <div className="px-[20px]">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid border-b" style={gridStyle}>
                {row.map((val, colIndex) => (
                  <div key={colIndex} className="text-center">
                    <input
                      type="number"
                      value={val ?? ""}
                      step="0.1"
                      placeholder="0"
                      onChange={(e) =>
                        handleChange(rowIndex, colIndex, e.target.value)
                      }
                      className={`${styles.editInput} w-full px-2 py-2 text-center`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Лінія з плюсом */}
          <div className="relative mx-[20px]">
            <div
              className="absolute top-[-2px] h-[3px] bg-blue-500 w-full hover:bg-blue-600 cursor-pointer "
              onClick={addRow}
            />
            <button
              onClick={addRow}
              className="absolute -top-3 right-[50%] w-5 h-5 pb-[3px] pl-[1px] rounded-full bg-blue-500 text-lg text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Нижній рядок — суми */}
          <div className="grid px-[20px] pb-[16px]" style={gridStyle}>
            {totals.map((total, i) => (
              <div key={i} className="p-2 font-bold text-center">
                {`${total}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
