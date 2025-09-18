import React from "react";

interface OverduePayment {
  projectName: string;
  amount: number;
}

interface Props {
  data: OverduePayment[];
}

export const ForNavigationMessage = ({ data }: Props) => {
  return (
    <div className="px-2 mt-4 text-[14px] font-inter text-black text-center max-h-[180px] overflow-y-auto space-y-2">
      {data.map((item, index) => (
        <div key={index}>
          {index === 0 && <div className="border-t border-[#FFB326] mb-1" />}

          <div className="pb-2">
            <div>
              <span className="font-semibold">{item.projectName}</span>
            </div>
            <div>
              <span className="text-red-600 font-semibold">
                {item.amount} грн
              </span>
            </div>
          </div>

          {index !== data.length - 1 && (
            <div className="border-b border-[#FFB326] my-1" />
          )}
        </div>
      ))}
    </div>
  );
};
